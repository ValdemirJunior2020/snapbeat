// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\backend\src\server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { renderRouter } from './routes/render';

const app = express();

const port = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);
const corsOrigin = process.env.BACKEND_CORS_ORIGIN || '*';
const tmpRoot = process.env.TMP_DIR || path.resolve(process.cwd(), 'tmp');

if (!fs.existsSync(tmpRoot)) {
  fs.mkdirSync(tmpRoot, { recursive: true });
}

app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: false,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'beat-video-maker-backend',
    port,
  });
});

app.use('/render', renderRouter);

app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({
    error: error?.message || 'Internal server error',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`BeatVideoMaker backend running on port ${port}`);
});