// FILE: src/utils/format.ts
import { VideoFormat, VideoStyle } from '@/types';

export function formatDate(timestamp?: number): string {
  if (!timestamp) return 'Just now';
  return new Date(timestamp).toLocaleString();
}

export function formatDurationSeconds(seconds?: number | null): string {
  if (!seconds || Number.isNaN(seconds)) return 'Unknown length';
  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatVideoFormat(format: VideoFormat): string {
  const map: Record<VideoFormat, string> = {
    portrait: 'Portrait 9:16',
    square: 'Square 1:1',
    landscape: 'Landscape 16:9'
  };
  return map[format];
}

export function formatVideoStyle(style: VideoStyle): string {
  const map: Record<VideoStyle, string> = {
    fast: 'Fast',
    romantic: 'Romantic',
    church: 'Church',
    cinematic: 'Cinematic',
    fun: 'Fun'
  };
  return map[style];
}

export function getAspectRatio(format: VideoFormat): { width: number; height: number } {
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
