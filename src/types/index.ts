// FILE: src/types/index.ts
export type VideoFormat = 'portrait' | 'square' | 'landscape';
export type VideoStyle = 'fast' | 'romantic' | 'church' | 'cinematic' | 'fun';
export type RenderStatus =
  | 'draft'
  | 'uploading'
  | 'pending'
  | 'processing'
  | 'complete'
  | 'error';

export interface User {
  uid: string;
  email: string | null;
}

export interface LocalMediaAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  width?: number;
  height?: number;
  duration?: number | null;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  style: VideoStyle;
  format: VideoFormat;
  bpm: number;
  photoCount: number;
  audioName: string;
  status: RenderStatus;
  videoUrl?: string;
  watermarkUrl?: string;
  renderJobId?: string;
  errorMessage?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface RenderJob {
  jobId: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  videoUrl?: string;
  error?: string;
}

export interface PurchaseState {
  isUnlocked: boolean;
  isChecking: boolean;
  isPurchasing: boolean;
  error?: string | null;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustration: string;
}

export interface CreateFlowState {
  photos: LocalMediaAsset[];
  audio?: LocalMediaAsset | null;
  useDefaultMusic: boolean;
  bpm?: number | null;
  format: VideoFormat;
  style: VideoStyle;
  titleText: string;
  watermark?: LocalMediaAsset | null;
}

export interface ProjectCreateInput {
  userId: string;
  title: string;
  style: VideoStyle;
  format: VideoFormat;
  bpm: number;
  photoCount: number;
  audioName: string;
  status?: RenderStatus;
  watermarkUrl?: string;
}

export interface RenderRequestPayload {
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

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}
