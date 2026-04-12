// FILE: src/utils/validation.ts
import { MAX_BPM, MAX_PHOTOS, MIN_BPM } from '@/constants/config';

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email.trim())) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}

export function validateBpm(value: string): string | null {
  if (!value.trim()) return null;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 'BPM must be numeric.';
  if (numberValue < MIN_BPM || numberValue > MAX_BPM) {
    return `BPM must be between ${MIN_BPM} and ${MAX_BPM}.`;
  }
  return null;
}

export function validateTitle(title: string): string | null {
  if (title.length > 60) return 'Title must be 60 characters or fewer.';
  return null;
}

export function validatePhotoCount(count: number): string | null {
  if (count <= 0) return 'Pick at least one photo.';
  if (count > MAX_PHOTOS) return `You can select up to ${MAX_PHOTOS} photos.`;
  return null;
}
