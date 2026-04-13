// FILE: app/_layout.tsx
//
// Important: React Native Firebase + RevenueCat require native builds.
// Run this project with an EAS development build or production build.
// Expo Go is not supported for this app.

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { colors } from '@/constants/colors';
import { configurePurchases } from '@/services/purchases.service';
import { ONBOARDING_KEY } from '@/constants/config';

function NavigationGate() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => setHasSeenOnboarding(value === 'true'))
      .catch(() => setHasSeenOnboarding(false));
  }, []);

  useEffect(() => {
    configurePurchases(user?.uid).catch(() => undefined);
  }, [user?.uid]);

  useEffect(() => {
    if (initializing || hasSeenOnboarding === null) return;

    const topSegment = segments[0];
    const inAuthGroup = topSegment === '(auth)';
    const inAppGroup = topSegment === '(app)';

    if (!hasSeenOnboarding && pathname !== '/onboarding') {
      router.replace('/onboarding');
      return;
    }

    if (hasSeenOnboarding && !user && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user && (!inAppGroup || inAuthGroup || pathname === '/onboarding')) {
      router.replace('/(app)');
    }
  }, [hasSeenOnboarding, initializing, pathname, router, segments, user]);

  if (initializing || hasSeenOnboarding === null) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationGate />
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
