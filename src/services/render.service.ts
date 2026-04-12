// FILE: src/services/render.service.ts
import { API_BASE_URL } from '@/constants/config';
import { RenderJob, RenderRequestPayload } from '@/types';

export async function createRenderJob(payload: RenderRequestPayload): Promise<{ jobId: string }> {
  const response = await fetch(`${API_BASE_URL}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to create render job.');
  }

  return response.json();
}

export async function getRenderJob(jobId: string): Promise<RenderJob> {
  const response = await fetch(`${API_BASE_URL}/render/${jobId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to load render job.');
  }

  return response.json();
}
