// FILE: src/components/ui/EmptyState.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  illustration?: string;
}

export default function EmptyState({
  title,
  subtitle,
  illustration = '🎬'
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.illustration}>{illustration}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.xs
  },
  illustration: {
    fontSize: 48
  },
  title: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '700',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center'
  }
});
