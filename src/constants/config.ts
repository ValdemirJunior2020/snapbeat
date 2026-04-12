// FILE: src/constants/config.ts
import { Platform } from 'react-native';

export const APP_NAME = 'BeatVideo Maker';
export const PROJECTS_COLLECTION = 'projects';
export const USERS_COLLECTION = 'users';
export const ONBOARDING_KEY = 'beatvideomaker_onboarding_complete';
export const CREATE_DRAFT_KEY = 'beatvideomaker_create_draft';
export const MAX_PHOTOS = 30;
export const MIN_BPM = 60;
export const MAX_BPM = 200;
export const DEFAULT_BPM = 120;
export const DEFAULT_BEATS_PER_SLIDE = 2;
export const RENDER_POLL_INTERVAL_MS = 3000;
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
export const PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://example.com/privacy';
export const TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL ?? 'https://example.com/terms';
export const DEFAULT_MUSIC_URL =
  process.env.EXPO_PUBLIC_DEFAULT_MUSIC_URL ??
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4f47743eff.mp3?filename=inspiring-cinematic-background-116199.mp3';
export const RC_IOS_API_KEY = process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? '';
export const RC_ANDROID_API_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? '';
export const EXPORT_UNLOCK_PRODUCT_ID = 'com.beatvideomaker.export_unlock';
export const EXPORT_UNLOCK_ENTITLEMENT_ID = 'export_unlock';
export const RC_API_KEY = Platform.select({
  ios: RC_IOS_API_KEY,
  android: RC_ANDROID_API_KEY,
  default: ''
}) ?? '';
