// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\preview\[projectId].tsx
import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Directory, File, Paths } from 'expo-file-system';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { getRenderDownloadUrl, RenderJob } from '@/services/render.service';
import { updateProject } from '@/services/firestore.service';
import { useToast } from '@/hooks/useToast';
import { useRender } from '@/hooks/useRender';

export default function PreviewScreen() {
  const { projectId, jobId } = useLocalSearchParams<{ projectId?: string; jobId?: string }>();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [localVideoUri, setLocalVideoUri] = useState<string | null>(null);

  const { job } = useRender(jobId ?? null, Boolean(jobId));

  const downloadUrl = useMemo(() => {
    if (!jobId) return null;
    return job?.downloadUrl || getRenderDownloadUrl(jobId);
  }, [job, jobId]);

  const handleSaveToPhone = async () => {
    if (!jobId || !downloadUrl) {
      showToast('Video is not ready yet.', 'warning');
      return;
    }

    try {
      setIsSaving(true);

      const directory = new Directory(Paths.cache, 'snapbeat');
      directory.create({ idempotent: true });

      const output = await File.downloadFileAsync(
        downloadUrl,
        directory
      );

      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        throw new Error('Photos permission is required to save the video to your phone.');
      }

      await MediaLibrary.saveToLibraryAsync(output.uri);
      setLocalVideoUri(output.uri);

      if (projectId) {
        await updateProject(projectId, {
          status: 'complete',
        });
      }

      showToast('Video saved to your phone.', 'success');
    } catch (error: any) {
      Alert.alert('Save failed', error?.message ?? 'Could not save the video.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      let shareUri = localVideoUri;

      if (!shareUri && jobId && downloadUrl) {
        const directory = new Directory(Paths.cache, 'snapbeat');
        directory.create({ idempotent: true });
        const output = await File.downloadFileAsync(downloadUrl, directory);
        shareUri = output.uri;
        setLocalVideoUri(output.uri);
      }

      if (!shareUri) {
        showToast('Video is not ready yet.', 'warning');
        return;
      }

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        throw new Error('Sharing is not available on this device.');
      }

      await Sharing.shareAsync(shareUri);
    } catch (error: any) {
      Alert.alert('Share failed', error?.message ?? 'Could not share the video.');
    }
  };

  if (!jobId) {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Missing render job</Text>
          <Text style={styles.subtitle}>Go back and render the video again.</Text>
          <Button label="Back" onPress={() => router.back()} />
        </Card>
      </SafeAreaView>
    );
  }

  if (!job || job.status === 'pending' || job.status === 'processing') {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Preparing your video</Text>
          <Text style={styles.subtitle}>Please wait while the final MP4 is being rendered.</Text>
          <LoadingSpinner />
        </Card>
      </SafeAreaView>
    );
  }

  if (job.status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Render failed</Text>
          <Text style={styles.subtitle}>{job.error ?? 'Something went wrong.'}</Text>
          <Button label="Back" onPress={() => router.back()} />
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Your video is ready</Text>
        <Text style={styles.subtitle}>
          The final MP4 will be saved on your phone, not in Firebase.
        </Text>

        <View style={styles.actions}>
          <Button label="Save to Phone" onPress={handleSaveToPhone} loading={isSaving} />
          <Button label="Share Video" onPress={handleShare} variant="secondary" />
          <Button label="Back to Dashboard" onPress={() => router.replace('/(app)')} variant="ghost" />
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    justifyContent: 'center',
  },
  card: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
});