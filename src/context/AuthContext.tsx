// FILE: src/context/AuthContext.tsx
import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { subscribeToAuthState } from '@/services/auth.service';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  firebaseUser: FirebaseAuthTypes.User | null;
  initializing: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  firebaseUser: null,
  initializing: true
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setFirebaseUser(nextUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      initializing,
      user: firebaseUser
        ? {
            uid: firebaseUser.uid,
            email: firebaseUser.email
          }
        : null
    }),
    [firebaseUser, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
