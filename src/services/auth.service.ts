// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\auth.service.ts

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const mapUser = (user: FirebaseUser | null): AuthUser | null => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
};

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(credential.user)!;
  },

  async signup(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName?.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }

    return mapUser(credential.user)!;
  },

  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async deleteCurrentUser(): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    await deleteUser(auth.currentUser);
  },

  getCurrentUser(): AuthUser | null {
    return mapUser(auth.currentUser);
  },

  subscribe(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(mapUser(user));
    });
  },
};