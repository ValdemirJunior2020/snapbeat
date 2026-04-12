// FILE: src/components/ui/Badge.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';

interface BadgeProps {
  label: string;
  tone?: 'accent' | 'success' | 'warning' | 'muted';
}

export default function Badge({ label, tone = 'accent' }: BadgeProps) {
  const backgroundColor =
    tone === 'success'
      ? colors.success
      : tone === 'warning'
      ? colors.warning
      : tone === 'muted'
      ? colors.surface
      : colors.accent;

  const textColor = tone === 'warning' ? colors.background : colors.text;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
