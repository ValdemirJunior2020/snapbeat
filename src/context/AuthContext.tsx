// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\context\AuthContext.tsx
import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { authService, AuthUser } from '@/services/auth.service';

interface AuthContextValue {
  user: AuthUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string, displayName?: string) => Promise<AuthUser>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  initializing: true,
  login: async () => {
    throw new Error('AuthContext not ready');
  },
  signup: async () => {
    throw new Error('AuthContext not ready');
  },
  forgotPassword: async () => {
    throw new Error('AuthContext not ready');
  },
  logout: async () => {
    throw new Error('AuthContext not ready');
  },
  deleteCurrentUser: async () => {
    throw new Error('AuthContext not ready');
  },
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribe((nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      login: authService.login,
      signup: authService.signup,
      forgotPassword: authService.forgotPassword,
      logout: authService.logout,
      deleteCurrentUser: authService.deleteCurrentUser,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}