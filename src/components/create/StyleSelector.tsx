// FILE: src/components/create/StyleSelector.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';
import { VideoStyle } from '@/types';
import { formatVideoStyle } from '@/utils/format';

const descriptions: Record<VideoStyle, string> = {
  fast: 'Quick cuts and energetic pacing.',
  romantic: 'Soft transitions and gentle mood.',
  church: 'Warm, reverent, and calm timing.',
  cinematic: 'Smooth motion with dramatic feel.',
  fun: 'Playful pacing with upbeat energy.'
};

interface StyleSelectorProps {
  selectedStyle: VideoStyle;
  onSelect: (style: VideoStyle) => void;
}

export default function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  const stylesList: VideoStyle[] = ['fast', 'romantic', 'church', 'cinematic', 'fun'];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {stylesList.map((style) => {
        const selected = style === selectedStyle;

        return (
          <TouchableOpacity
            key={style}
            activeOpacity={0.75}
            onPress={() => onSelect(style)}
            style={[styles.itemWrapper, selected && styles.itemWrapperSelected]}
          >
            <Card style={[styles.itemCard, selected && styles.itemCardSelected]}>
              <Text style={styles.itemTitle}>{formatVideoStyle(style)}</Text>
              <Text style={styles.itemSubtitle}>{descriptions[style]}</Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingRight: spacing.sm
  },
  itemWrapper: {
    width: 180
  },
  itemWrapperSelected: {
    transform: [{ scale: 1.01 }]
  },
  itemCard: {
    minHeight: 120,
    gap: spacing.xs
  },
  itemCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim
  },
  itemTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800'
  },
  itemSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption
  }
});
