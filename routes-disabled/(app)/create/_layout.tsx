// FILE: app/(app)/create/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function CreateFlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="photos" options={{ title: 'Choose Photos' }} />
      <Stack.Screen name="music" options={{ title: 'Choose Music' }} />
      <Stack.Screen name="options" options={{ title: 'Video Options' }} />
      <Stack.Screen name="processing" options={{ title: 'Processing' }} />
    </Stack>
  );
}
