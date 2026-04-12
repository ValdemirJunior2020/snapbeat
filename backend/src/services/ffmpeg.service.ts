// FILE: backend/src/services/ffmpeg.service.ts
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'node:path';
import fs from 'node:fs/promises';
import { FfmpegRenderOptions } from '../types';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH || ffmpegStatic);
}

function getOutputSize(format: FfmpegRenderOptions['format']) {
  switch (format) {
    case 'square':
      return { width: 1080, height: 1080 };
    case 'landscape':
      return { width: 1920, height: 1080 };
    case 'portrait':
    default:
      return { width: 1080, height: 1920 };
  }
}

function escapeDrawtext(text: string): string {
  return text.replace(/:/g, '\\:').replace(/'/g, "\\'").replace(/,/g, '\\,');
}

function calculateSlideDuration(bpm: number, style: FfmpegRenderOptions['style']) {
  const beatsPerSlide =
    style === 'fast' ? 1.5 : style === 'fun' ? 1.8 : style === 'cinematic' ? 2.5 : 2;

  return Math.max(1.25, Number(((60 / Math.max(60, bpm)) * beatsPerSlide).toFixed(2)));
}

export async function renderSlideshowVideo(
  options: FfmpegRenderOptions,
  onProgress?: (progress: number) => void
) {
  const { width, height } = getOutputSize(options.format);
  const slideDuration = calculateSlideDuration(options.bpm, options.style);
  const transitionDuration = 0.45;
  const fps = 30;
  const totalDuration = slideDuration * options.photos.length;

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });

  return new Promise<void>((resolve, reject) => {
    const command = ffmpeg();

    options.photos.forEach((photoPath) => {
      command
        .addInput(photoPath)
        .inputOptions(['-loop 1', `-t ${slideDuration}`]);
    });

    command.addInput(options.audioPath);

    const watermarkInputIndex = options.photos.length + 1;
    if (options.watermarkPath) {
      command.addInput(options.watermarkPath);
    }

    const complexFilters: string[] = [];
    const framesPerSlide = Math.max(1, Math.round(slideDuration * fps));

    options.photos.forEach((_, index) => {
      complexFilters.push(
        `[${index}:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},zoompan=z='min(zoom+0.0015,1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${framesPerSlide}:s=${width}x${height},fps=${fps},format=yuv420p,setsar=1[v${index}]`
      );
    });

    let currentLabel = '[v0]';
    for (let index = 1; index < options.photos.length; index += 1) {
      const outputLabel = `[x${index}]`;
      const offset = Number((slideDuration * index - transitionDuration * index).toFixed(2));
      complexFilters.push(
        `${currentLabel}[v${index}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}${outputLabel}`
      );
      currentLabel = outputLabel;
    }

    let videoLabel = currentLabel;

    if (options.titleText?.trim()) {
      const titleLabel = '[withtitle]';
      complexFilters.push(
        `${videoLabel}drawtext=fontfile='${options.fontFile}':text='${escapeDrawtext(
          options.titleText.trim()
        )}':fontcolor=white:fontsize=56:box=1:boxcolor=black@0.35:boxborderw=18:x=(w-text_w)/2:y=h*0.08${titleLabel}`
      );
      videoLabel = titleLabel;
    }

    if (options.watermarkPath) {
      const watermarkLabel = '[withwm]';
      complexFilters.push(
        `[${watermarkInputIndex}:v]scale=220:-1[wm];${videoLabel}[wm]overlay=W-w-32:H-h-32${watermarkLabel}`
      );
      videoLabel = watermarkLabel;
    }

    const audioInputIndex = options.photos.length;
    complexFilters.push(
      `[${audioInputIndex}:a]atrim=0:${totalDuration},asetpts=N/SR/TB,afade=t=out:st=${Math.max(
        0,
        totalDuration - 2
      )}:d=2[aout]`
    );

    command
      .complexFilter(complexFilters)
      .outputOptions([
        `-map ${videoLabel}`,
        '-map [aout]',
        '-shortest',
        '-movflags +faststart',
        '-pix_fmt yuv420p',
        '-c:v libx264',
        '-preset medium',
        '-profile:v high',
        '-level 4.1',
        '-crf 22',
        '-c:a aac',
        '-b:a 192k'
      ])
      .on('progress', (progress) => {
        if (typeof progress.percent === 'number') {
          onProgress?.(Math.max(0, Math.min(100, Math.round(progress.percent))));
        }
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error))
      .save(options.outputPath);
  });
}
