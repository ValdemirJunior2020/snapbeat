// FILE: src/components/ui/Toast.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';
import { ToastMessage } from '@/types';

interface ToastProps {
  message: ToastMessage;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  const backgroundColor =
    message.type === 'error'
      ? colors.error
      : message.type === 'warning'
      ? colors.warning
      : colors.success;

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onClose} style={[styles.toast, { backgroundColor }]}>
      <View>
        <Text style={styles.title}>
          {message.type === 'error'
            ? 'Error'
            : message.type === 'warning'
            ? 'Notice'
            : 'Success'}
        </Text>
        <Text style={styles.message}>{message.message}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toast: {
    marginTop: 56,
    marginHorizontal: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.large
  },
  title: {
    color: colors.background,
    fontSize: typography.body,
    fontWeight: '800'
  },
  message: {
    color: colors.background,
    fontSize: typography.caption,
    marginTop: 4
  }
});
