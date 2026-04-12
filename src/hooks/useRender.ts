// FILE: src/hooks/useRender.ts
import { useCallback, useEffect, useState } from 'react';
import { RENDER_POLL_INTERVAL_MS } from '@/constants/config';
import { getRenderJob } from '@/services/render.service';
import { RenderJob } from '@/types';

export function useRender(jobId?: string | null, enabled = true) {
  const [job, setJob] = useState<RenderJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const poll = useCallback(async () => {
    if (!jobId) return;

    try {
      setIsPolling(true);
      const nextJob = await getRenderJob(jobId);
      setJob(nextJob);
      setError(null);
    } catch (nextError: any) {
      setError(nextError?.message ?? 'Polling failed.');
    } finally {
      setIsPolling(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!enabled || !jobId) return;

    poll();
    const intervalId = setInterval(poll, RENDER_POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [enabled, jobId, poll]);

  return {
    job,
    isPolling,
    error,
    poll
  };
}
