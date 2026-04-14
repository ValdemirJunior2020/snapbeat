// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\_layout.tsx
import React, { useContext, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { colors } from '@/constants/colors';
import { AuthContext, AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

function NavigationGate() {
  const { user, initializing } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;

    const topSegment = segments[0];
    const inAuthGroup = topSegment === '(auth)';
    const inAppGroup = topSegment === '(app)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user && !inAppGroup) {
      router.replace('/(app)');
    }
  }, [initializing, router, segments, user]);

  if (initializing) {
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