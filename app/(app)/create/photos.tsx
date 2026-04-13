// FILE: app/(app)/create/photos.tsx
import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import PhotoGrid from '@/components/create/PhotoGrid';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, MAX_PHOTOS } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { CreateFlowState, LocalMediaAsset } from '@/types';
import { useToast } from '@/hooks/useToast';

const initialDraft: CreateFlowState = {
  photos: [],
  useDefaultMusic: true,
  bpm: 120,
  format: 'portrait',
  style: 'fast',
  titleText: '',
  watermark: null,
  audio: null
};

export default function PhotosScreen() {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<LocalMediaAsset[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CREATE_DRAFT_KEY)
      .then((rawValue) => {
        const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;
        setPhotos(parsed.photos ?? []);
      })
      .catch(() => setPhotos([]));
  }, []);

  const badgeLabel = useMemo(() => `${photos.length} / ${MAX_PHOTOS}`, [photos.length]);

  const saveDraft = async (nextPhotos: LocalMediaAsset[]) => {
    const rawValue = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
    const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;

    const nextState: CreateFlowState = {
      ...initialDraft,
      ...parsed,
      photos: nextPhotos
    };

    await AsyncStorage.setItem(CREATE_DRAFT_KEY, JSON.stringify(nextState));
    setPhotos(nextPhotos);
  };

  const pickPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Photo library permission is required.', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS
    });

    if (result.canceled) return;

    const nextPhotos: LocalMediaAsset[] = result.assets.slice(0, MAX_PHOTOS).map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      width: asset.width,
      height: asset.height,
      duration: asset.duration ?? null
    }));

    await saveDraft(nextPhotos);

    if (result.assets.length > MAX_PHOTOS) {
      showToast(`Only the first ${MAX_PHOTOS} photos were kept.`, 'warning');
    }
  };

  const handleNext = () => {
    if (!photos.length) {
      showToast('Select at least one photo.', 'warning');
      return;
    }

    router.push('/(app)/create/music');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Pick up to 30 photos</Text>
        <Badge label={badgeLabel} />
      </View>

      <View style={styles.actions}>
        <Button label="Pick Photos" onPress={pickPhotos} />
      </View>

      <View style={styles.content}>
        {photos.length ? (
          <PhotoGrid
            photos={photos}
            onReorder={saveDraft}
            onRemove={(index) => saveDraft(photos.filter((_, itemIndex) => itemIndex !== index))}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.emptyWrap}>
            <EmptyState
              illustration="🖼️"
              title="No photos selected"
              subtitle="Choose the images that will become your slideshow."
            />
          </ScrollView>
        )}
      </View>

      <Button label="Next" onPress={handleNext} disabled={!photos.length} style={styles.bottomButton} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800'
  },
  actions: {
    gap: spacing.sm
  },
  content: {
    flex: 1
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  bottomButton: {
    marginTop: spacing.sm
  }
});
