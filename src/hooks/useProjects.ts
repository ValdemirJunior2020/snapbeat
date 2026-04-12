// FILE: src/hooks/useProjects.ts
import { useCallback, useEffect, useState } from 'react';
import { observeProjects } from '@/services/firestore.service';
import { Project } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = observeProjects(
      user.uid,
      (nextProjects) => {
        setProjects(nextProjects);
        setError(null);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [refreshKey, user?.uid]);

  return {
    projects,
    isLoading,
    error,
    refresh
  };
}
