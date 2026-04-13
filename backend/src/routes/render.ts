// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\backend\src\routes\render.ts
import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { renderSlideshowVideo } from '../services/ffmpeg.service';

type RenderJobRecord = {
  id: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  createdAt: number;
  error?: string;
  outputPath?: string;
  tempDir?: string;
  downloadUrl?: string;
};

export const renderJobs = new Map<string, RenderJobRecord>();
export const renderRouter = Router();

function getTmpRoot() {
  return process.env.TMP_DIR || path.resolve(process.cwd(), 'tmp');
}

function createTempDir(jobId: string) {
  return path.join(getTmpRoot(), jobId);
}

function cleanupJobLater(jobId: string, delayMs = 30 * 60 * 1000) {
  setTimeout(async () => {
    const job = renderJobs.get(jobId);
    if (!job?.tempDir) return;

    await fsp.rm(job.tempDir, { recursive: true, force: true }).catch(() => undefined);
    renderJobs.delete(jobId);
  }, delayMs);
}

const upload = multer({
  dest: path.join(getTmpRoot(), 'incoming'),
  limits: {
    files: 40,
    fileSize: 50 * 1024 * 1024,
  },
});

renderRouter.post(
  '/',
  upload.fields([
    { name: 'photos', maxCount: 30 },
    { name: 'audio', maxCount: 1 },
    { name: 'watermark', maxCount: 1 },
  ]),
  async (req, res) => {
    const files = req.files as {
      photos?: Express.Multer.File[];
      audio?: Express.Multer.File[];
      watermark?: Express.Multer.File[];
    };

    const photos = files?.photos ?? [];
    const audio = files?.audio?.[0];
    const watermark = files?.watermark?.[0];

    const { format, style, bpm, titleText } = req.body;

    if (!photos.length || !audio) {
      return res.status(400).json({ error: 'Photos and audio are required.' });
    }

    const jobId = uuidv4();
    const tempDir = createTempDir(jobId);

    await fsp.mkdir(tempDir, { recursive: true });

    const movedPhotoPaths: string[] = [];
    for (let index = 0; index < photos.length; index += 1) {
      const source = photos[index].path;
      const ext = path.extname(photos[index].originalname || '.jpg') || '.jpg';
      const destination = path.join(tempDir, `photo-${index + 1}${ext}`);
      await fsp.rename(source, destination);
      movedPhotoPaths.push(destination);
    }

    const audioExt = path.extname(audio.originalname || '.m4a') || '.m4a';
    const audioPath = path.join(tempDir, `audio${audioExt}`);
    await fsp.rename(audio.path, audioPath);

    let watermarkPath: string | undefined;
    if (watermark) {
      const watermarkExt = path.extname(watermark.originalname || '.png') || '.png';
      watermarkPath = path.join(tempDir, `watermark${watermarkExt}`);
      await fsp.rename(watermark.path, watermarkPath);
    }

    const outputPath = path.join(tempDir, 'output.mp4');

    renderJobs.set(jobId, {
      id: jobId,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      tempDir,
      outputPath,
      downloadUrl: `/render/${jobId}/download`,
    });

    res.json({ jobId });

    void (async () => {
      try {
        renderJobs.set(jobId, {
          ...(renderJobs.get(jobId) as RenderJobRecord),
          status: 'processing',
          progress: 10,
        });

        await renderSlideshowVideo(
          {
            photos: movedPhotoPaths,
            audioPath,
            format,
            style,
            bpm: Number(bpm || 120),
            titleText: titleText?.trim() || undefined,
            watermarkPath,
            outputPath,
            applyWatermark: String(req.body.applyWatermark) === 'true',
            fontFile:
              process.env.FONT_FILE || '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
          },
          (progress) => {
            renderJobs.set(jobId, {
              ...(renderJobs.get(jobId) as RenderJobRecord),
              status: 'processing',
              progress: Math.max(10, Math.min(100, progress)),
            });
          }
        );

        renderJobs.set(jobId, {
          ...(renderJobs.get(jobId) as RenderJobRecord),
          status: 'complete',
          progress: 100,
        });

        cleanupJobLater(jobId);
      } catch (error: any) {
        renderJobs.set(jobId, {
          ...(renderJobs.get(jobId) as RenderJobRecord),
          status: 'error',
          progress: 100,
          error: error?.message ?? 'Render failed.',
        });
      }
    })();
  }
);

renderRouter.get('/:jobId', async (req, res) => {
  const job = renderJobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: 'Render job not found.' });
  }

  return res.json({
    status: job.status,
    progress: job.progress,
    error: job.error,
    downloadUrl: job.status === 'complete' ? `/render/${job.id}/download` : undefined,
  });
});

renderRouter.get('/:jobId/download', async (req, res) => {
  const job = renderJobs.get(req.params.jobId);

  if (!job || job.status !== 'complete' || !job.outputPath) {
    return res.status(404).json({ error: 'Rendered video not found.' });
  }

  if (!fs.existsSync(job.outputPath)) {
    return res.status(404).json({ error: 'Rendered file is no longer available.' });
  }

  return res.download(job.outputPath, `SnapBeat-${job.id}.mp4`, async () => {
    if (job.tempDir) {
      await fsp.rm(job.tempDir, { recursive: true, force: true }).catch(() => undefined);
    }
    renderJobs.delete(job.id);
  });
});