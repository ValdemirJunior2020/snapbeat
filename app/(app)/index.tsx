// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\index.tsx
import React, { useCallback } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProjectList from '@/components/project/ProjectList';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { useProjects } from '@/hooks/useProjects';

export default function AppHomeScreen() {
  const { projects, loading, refreshing, refreshProjects, deleteProject } = useProjects();

  const handleCreate = useCallback(() => {
    router.push('/(app)/create/photos');
  }, []);

  const handleOpenProject = useCallback((projectId: string) => {
    router.push(`/(app)/preview/${projectId}`);
  }, []);

  const handleOpenSettings = useCallback(() => {
    router.push('/(app)/settings');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshProjects}
            tintColor={colors.accent}
          />
        }
      >
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.eyebrow}>BeatVideo Maker</Text>
            <Text style={styles.title}>Your Projects</Text>
            <Text style={styles.subtitle}>
              Create music-driven slideshow videos, preview them, and share them anywhere.
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.75} onPress={handleOpenSettings} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.heroCard}>
          <Text style={styles.heroTitle}>Create a new video</Text>
          <Text style={styles.heroSubtitle}>
            Add photos, choose music, pick a style, and generate your slideshow.
          </Text>
          <Button label="Create New Video" onPress={handleCreate} />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <LoadingSpinner />
          </View>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Your videos will appear here after you create your first one."
            actionLabel="Create Your First Video"
            onAction={handleCreate}
          />
        ) : (
          <ProjectList
            projects={projects}
            onOpenProject={handleOpenProject}
            onDeleteProject={deleteProject}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  headerTextBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  settingsButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  settingsButtonText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  heroCard: {
    gap: spacing.sm,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  sectionHeader: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800',
  },
  loadingWrap: {
    paddingVertical: spacing.lg,
  },
});