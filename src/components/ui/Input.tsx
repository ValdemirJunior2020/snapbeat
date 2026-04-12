// FILE: src/components/ui/Input.tsx
import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from 'react-native';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  keyboardType?: KeyboardTypeOptions;
}

export default function Input({
  label,
  value,
  onChangeText,
  error,
  keyboardType,
  ...rest
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        keyboardType={keyboardType}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    fontSize: typography.body
  },
  inputError: {
    borderColor: colors.error
  },
  error: {
    color: colors.error,
    fontSize: typography.caption
  }
});
