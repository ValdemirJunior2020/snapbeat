// FILE: src/components/ui/Card.tsx
import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { radii, spacing } from '@/constants/styles';

interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm
  }
});
