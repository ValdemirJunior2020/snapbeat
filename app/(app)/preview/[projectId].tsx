// FILE: app/(app)/preview/[projectId].tsx
import React, { useEffect, useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Video from 'react-native-video';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/useToast';
import { deleteProject, observeProject } from '@/services/firestore.service';
import { Project } from '@/types';
import { formatDate, formatVideoFormat, formatVideoStyle } from '@/utils/format';

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ projectId: string }>();
  const { isUnlocked, isChecking } = usePurchases();
  const { showToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (!params.projectId) return;
    return observeProject(params.projectId, setProject, () => {
      showToast('Unable to load project.', 'error');
    });
  }, [params.projectId, showToast]);

  const handleDelete = () => {
    if (!project?.id) return;

    Alert.alert('Delete project', 'This removes the project record. Uploaded storage files are not automatically purged.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProject(project.id);
          showToast('Project deleted.', 'success');
          router.replace('/(app)');
        }
      }
    ]);
  };

  const handleShare = async () => {
    if (!project?.videoUrl) {
      showToast('Video is not ready yet.', 'warning');
      return;
    }

    if (!isUnlocked) {
      router.push('/(app)/paywall');
      return;
    }

    try {
      setIsSharing(true);
      const fileUri = `${FileSystem.cacheDirectory ?? FileSystem.documentDirectory}beatvideo-${project.id}.mp4`;
      await FileSystem.downloadAsync(project.videoUrl, fileUri);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'video/mp4',
        dialogTitle: 'Share your video'
      });
    } catch (error: any) {
      showToast(error?.message ?? 'Unable to share the video.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleInstagram = async () => {
    if (!project?.videoUrl) return;

    const canOpenInstagram = await Linking.canOpenURL('instagram://library');
    if (!canOpenInstagram) {
      showToast('Instagram is not installed on this device.', 'warning');
      return;
    }

    const fileUri = `${FileSystem.cacheDirectory ?? FileSystem.documentDirectory}beatvideo-${project.id}.mp4`;
    await FileSystem.downloadAsync(project.videoUrl, fileUri);
    await Linking.openURL(`instagram://library?AssetPath=${encodeURIComponent(fileUri)}`);
  };

  if (!project) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {project.videoUrl ? (
          <Card style={styles.videoCard}>
            <Video
              controls
              paused={false}
              repeat
              resizeMode="contain"
              source={{ uri: project.videoUrl }}
              style={styles.video}
            />
          </Card>
        ) : (
          <Card style={styles.videoCard}>
            <Text style={styles.pendingText}>Your video is still processing.</Text>
          </Card>
        )}

        <Card style={styles.metaCard}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.meta}>{formatVideoStyle(project.style)}</Text>
          <Text style={styles.meta}>{formatVideoFormat(project.format)}</Text>
          <Text style={styles.meta}>{formatDate(project.createdAt)}</Text>
          <Text style={styles.meta}>Status: {project.status}</Text>
        </Card>

        <View style={styles.actions}>
          <Button label="Regenerate" onPress={() => router.push('/(app)/create/options')} variant="secondary" />
          <Button label="Delete Project" onPress={handleDelete} variant="danger" />
          <Button label="Export / Share" onPress={handleShare} loading={isSharing || isChecking} />
          <Button label="Open in Instagram" onPress={handleInstagram} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.md,
    gap: spacing.md
  },
  videoCard: {
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: 320,
    backgroundColor: '#000'
  },
  pendingText: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center'
  },
  metaCard: {
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800'
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  actions: {
    gap: spacing.sm
  }
});
