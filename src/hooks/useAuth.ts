// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\hooks\useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}