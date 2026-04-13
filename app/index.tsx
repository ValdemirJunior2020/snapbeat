// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\index.tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { ONBOARDING_KEY } from '@/constants/config';

export default function IndexScreen() {
  const { user, initializing } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        if (mounted) {
          setHasSeenOnboarding(value === 'true');
        }
      })
      .catch(() => {
        if (mounted) {
          setHasSeenOnboarding(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (initializing || hasSeenOnboarding === null) {
    return <LoadingSpinner />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)" />;
}