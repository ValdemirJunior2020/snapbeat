// FILE: app/(app)/index.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProjectList from '@/components/project/ProjectList';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { useProjects } from '@/hooks/useProjects';

export default function HomeScreen() {
  const { projects, isLoading, refresh } = useProjects();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>BeatVideo Maker</Text>
          <Text style={styles.title}>Recent projects</Text>
        </View>

        <TouchableOpacity activeOpacity={0.75} onPress={() => router.push('/(app)/settings')}>
          <Ionicons color={colors.text} name="settings-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.ctaWrap}>
        <Button label="Create New Video" onPress={() => router.push('/(app)/create/photos')} />
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProjectList
          projects={projects}
          refreshing={isLoading}
          onRefresh={refresh}
          onOpenProject={(projectId) => router.push(`/(app)/preview/${projectId}`)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typography.label,
    fontWeight: '700',
    letterSpacing: 1
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800'
  },
  ctaWrap: {
    paddingBottom: spacing.sm
  }
});
