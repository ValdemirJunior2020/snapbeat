// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\render.service.ts
import { API_BASE_URL } from '@/constants/config';

export interface RenderJob {
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
  downloadUrl?: string;
}

export async function createRenderJob(formData: FormData): Promise<{ jobId: string }> {
  const response = await fetch(`${API_BASE_URL}/render`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to create render job.');
  }

  return await response.json();
}

export async function getRenderJob(jobId: string): Promise<RenderJob> {
  const response = await fetch(`${API_BASE_URL}/render/${jobId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to load render job.');
  }

  return await response.json();
}

export function getRenderDownloadUrl(jobId: string): string {
  return `${API_BASE_URL}/render/${jobId}/download`;
}