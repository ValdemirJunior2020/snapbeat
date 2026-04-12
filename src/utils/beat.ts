// FILE: src/utils/beat.ts
import { DEFAULT_BEATS_PER_SLIDE, DEFAULT_BPM, MAX_BPM, MIN_BPM } from '@/constants/config';

export function clampBpm(value?: number | null): number {
  const bpm = typeof value === 'number' && !Number.isNaN(value) ? value : DEFAULT_BPM;
  return Math.max(MIN_BPM, Math.min(MAX_BPM, bpm));
}

export function calculateSlideDurationFromBpm(bpm?: number | null, beatsPerSlide = DEFAULT_BEATS_PER_SLIDE): number {
  const safeBpm = clampBpm(bpm);
  return Number(((60 / safeBpm) * beatsPerSlide).toFixed(2));
}

export function estimateVideoDuration(photoCount: number, bpm?: number | null, beatsPerSlide = DEFAULT_BEATS_PER_SLIDE): number {
  return Number((photoCount * calculateSlideDurationFromBpm(bpm, beatsPerSlide)).toFixed(2));
}
