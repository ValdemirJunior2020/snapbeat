// FILE: src/components/ui/ProgressBar.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/styles';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, progress))}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent
  }
});
