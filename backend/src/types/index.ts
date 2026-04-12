// FILE: backend/src/types/index.ts
export type VideoFormat = 'portrait' | 'square' | 'landscape';
export type VideoStyle = 'fast' | 'romantic' | 'church' | 'cinematic' | 'fun';

export interface RenderRequestBody {
  photos: string[];
  audioUrl: string;
  format: VideoFormat;
  style: VideoStyle;
  bpm: number;
  titleText?: string;
  watermarkUrl?: string;
  userId: string;
  projectId: string;
}

export interface RenderJobRecord {
  id: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  videoUrl?: string;
  error?: string;
  createdAt: number;
}

export interface FfmpegRenderOptions {
  photos: string[];
  audioPath: string;
  format: VideoFormat;
  style: VideoStyle;
  bpm: number;
  titleText?: string;
  watermarkPath?: string;
  outputPath: string;
  fontFile: string;
}
