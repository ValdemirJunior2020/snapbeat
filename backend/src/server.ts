// FILE: backend/src/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { renderRouter } from './routes/render';
import { getAdminApp } from './services/storage.service';

const app = express();
const port = Number(process.env.BACKEND_PORT || 4000);

getAdminApp();

app.use(
  cors({
    origin: process.env.BACKEND_CORS_ORIGIN?.split(',') ?? '*'
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/render', renderRouter);

app.listen(port, () => {
  console.log(`BeatVideo Maker render server listening on port ${port}`);
});
