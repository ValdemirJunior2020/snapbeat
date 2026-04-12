// FILE: app/(app)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="paywall" options={{ title: 'Unlock Exports', presentation: 'modal' }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="preview/[projectId]" options={{ title: 'Preview' }} />
    </Stack>
  );
}
