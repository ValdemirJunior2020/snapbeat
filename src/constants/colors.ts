// FILE: src/constants/colors.ts
export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  card: '#222222',
  accent: '#FF3366',
  accentDim: '#FF336640',
  text: '#FFFFFF',
  textMuted: '#888888',
  border: '#333333',
  success: '#00C853',
  error: '#FF5252',
  warning: '#FFD740'
} as const;

export type AppColorKey = keyof typeof colors;
