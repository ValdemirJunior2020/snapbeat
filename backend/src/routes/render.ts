// FILE: backend/src/routes/render.ts
import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { renderSlideshowVideo } from '../services/ffmpeg.service';
import {
  downloadRemoteFile,
  updateProjectAfterRender,
  uploadRenderedVideo
} from '../services/storage.service';
import { RenderJobRecord, RenderRequestBody } from '../types';

export const renderJobs = new Map<string, RenderJobRecord>();
export const renderRouter = Router();

function createTempDir(jobId: string) {
  const tmpRoot = process.env.TMP_DIR || path.resolve(process.cwd(), 'tmp');
  return path.join(tmpRoot, jobId);
}

renderRouter.post('/', async (req, res) => {
  const body = req.body as RenderRequestBody;

  if (!body?.photos?.length || !body.audioUrl || !body.userId || !body.projectId) {
    return res.status(400).json({ error: 'Invalid render request payload.' });
  }

  const jobId = uuidv4();

  renderJobs.set(jobId, {
    id: jobId,
    status: 'pending',
    progress: 0,
    createdAt: Date.now()
  });

  res.json({ jobId });

  void (async () => {
    const tempDir = createTempDir(jobId);

    try {
      await fs.mkdir(tempDir, { recursive: true });

      renderJobs.set(jobId, {
        id: jobId,
        status: 'processing',
        progress: 5,
        createdAt: Date.now()
      });

      const photoPaths: string[] = [];
      for (let index = 0; index < body.photos.length; index += 1) {
        const destination = path.join(tempDir, `photo-${index}.jpg`);
        await downloadRemoteFile(body.photos[index], destination);
        photoPaths.push(destination);
        renderJobs.set(jobId, {
          ...(renderJobs.get(jobId) as RenderJobRecord),
          progress: Math.min(20, 5 + Math.round(((index + 1) / body.photos.length) * 15))
        });
      }

      const audioPath = path.join(tempDir, 'audio-track');
      await downloadRemoteFile(body.audioUrl, audioPath);

      let watermarkPath: string | undefined;
      if (body.watermarkUrl) {
        watermarkPath = path.join(tempDir, 'watermark.png');
        await downloadRemoteFile(body.watermarkUrl, watermarkPath);
      }

      const outputPath = path.join(tempDir, 'output.mp4');

      await renderSlideshowVideo(
        {
          photos: photoPaths,
          audioPath,
          format: body.format,
          style: body.style,
          bpm: body.bpm,
          titleText: body.titleText,
          watermarkPath,
          outputPath,
          fontFile:
            process.env.FONT_FILE ||
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
        },
        (progress) => {
          renderJobs.set(jobId, {
            ...(renderJobs.get(jobId) as RenderJobRecord),
            status: 'processing',
            progress: Math.max(20, progress)
          });
        }
      );

      const videoUrl = await uploadRenderedVideo(outputPath, body.userId, body.projectId);

      await updateProjectAfterRender(body.projectId, {
        status: 'complete',
        videoUrl,
        renderJobId: jobId,
        errorMessage: null
      });

      renderJobs.set(jobId, {
        id: jobId,
        status: 'complete',
        progress: 100,
        videoUrl,
        createdAt: Date.now()
      });
    } catch (error: any) {
      const message = error?.message ?? 'Render failed.';

      await updateProjectAfterRender(body.projectId, {
        status: 'error',
        errorMessage: message,
        renderJobId: jobId
      }).catch(() => undefined);

      renderJobs.set(jobId, {
        id: jobId,
        status: 'error',
        progress: 100,
        error: message,
        createdAt: Date.now()
      });
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    }
  })();
});

renderRouter.get('/:jobId', async (req, res) => {
  const job = renderJobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: 'Render job not found.' });
  }

  return res.json({
    status: job.status,
    progress: job.progress,
    videoUrl: job.videoUrl,
    error: job.error
  });
});
