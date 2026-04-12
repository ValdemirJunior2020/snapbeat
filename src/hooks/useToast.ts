// FILE: src/hooks/useToast.ts
import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

export function useToast() {
  return useContext(ToastContext);
}
