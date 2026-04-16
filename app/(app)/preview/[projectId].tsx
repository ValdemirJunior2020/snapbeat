// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\preview\[projectId].tsx
import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Video from 'react-native-video';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ projectId?: string; videoUri?: string }>();
  const [isSaving, setIsSaving] = useState(false);

  const videoUri = useMemo(() => {
    if (!params.videoUri) return null;
    return decodeURIComponent(params.videoUri);
  }, [params.videoUri]);

  const handleSaveToPhone = async () => {
    if (!videoUri) {
      Alert.alert('Missing video', 'No local video file was found.');
      return;
    }

    try {
      setIsSaving(true);
      const permission = await MediaLibrary.requestPermissionsAsync(true);

      if (!permission.granted) {
        throw new Error('Photos permission is required to save the video.');
      }

      await MediaLibrary.saveToLibraryAsync(videoUri);
      Alert.alert('Saved', 'The video was saved to your phone.');
    } catch (error: any) {
      Alert.alert('Save failed', error?.message ?? 'Could not save the video.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!videoUri) {
      Alert.alert('Missing video', 'No local video file was found.');
      return;
    }

    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        throw new Error('Sharing is not available on this device.');
      }

      await Sharing.shareAsync(videoUri);
    } catch (error: any) {
      Alert.alert('Share failed', error?.message ?? 'Could not share the video.');
    }
  };

  if (!videoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Missing local video</Text>
          <Text style={styles.subtitle}>Go back and render again on this phone.</Text>
          <Button label="Back" onPress={() => router.back()} />
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Your video is ready</Text>
        <Text style={styles.subtitle}>Rendered on your phone and ready to save.</Text>
      </Card>

      <View style={styles.videoWrap}>
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          controls
          resizeMode="contain"
          paused={false}
          repeat
        />
      </View>

      <View style={styles.actions}>
        <Button label="Save to Phone" onPress={handleSaveToPhone} loading={isSaving} />
        <Button label="Share Video" onPress={handleShare} variant="secondary" />
        <Button label="Back to Dashboard" onPress={() => router.replace('/(app)')} variant="ghost" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
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
  videoWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  actions: {
    gap: spacing.sm,
  },
});