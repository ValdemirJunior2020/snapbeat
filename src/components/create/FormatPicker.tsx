// FILE: src/components/create/FormatPicker.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';
import { VideoFormat } from '@/types';
import { formatVideoFormat } from '@/utils/format';

interface FormatPickerProps {
  selectedFormat: VideoFormat;
  onSelect: (format: VideoFormat) => void;
}

export default function FormatPicker({ selectedFormat, onSelect }: FormatPickerProps) {
  const formats: VideoFormat[] = ['portrait', 'square', 'landscape'];

  return (
    <View style={styles.container}>
      {formats.map((format) => {
        const selected = format === selectedFormat;

        return (
          <TouchableOpacity
            key={format}
            activeOpacity={0.75}
            onPress={() => onSelect(format)}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
              {formatVideoFormat(format)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  pill: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 12
  },
  pillSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim
  },
  pillText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  pillTextSelected: {
    color: colors.text
  }
});
