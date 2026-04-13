// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\context\AuthContext.tsx
import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { authService, AuthUser } from '@/services/auth.service';

interface AuthContextValue {
  user: AuthUser | null;
  initializing: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  initializing: true,
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
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}