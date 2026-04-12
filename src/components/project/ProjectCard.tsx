// FILE: src/components/project/ProjectCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';
import { Project } from '@/types';
import { formatDate, formatVideoFormat, formatVideoStyle } from '@/utils/format';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const badgeTone =
    project.status === 'complete'
      ? 'success'
      : project.status === 'error'
      ? 'warning'
      : 'accent';

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.preview}>
            <Text style={styles.previewText}>{project.photoCount} photos</Text>
          </View>
          <Badge label={project.status.toUpperCase()} tone={badgeTone} />
        </View>

        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.meta}>
          {formatVideoStyle(project.style)} • {formatVideoFormat(project.format)}
        </Text>
        <Text style={styles.meta}>{project.audioName}</Text>
        <Text style={styles.date}>{formatDate(project.createdAt)}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    borderRadius: radii.large
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preview: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm
  },
  previewText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800'
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.caption
  }
});
