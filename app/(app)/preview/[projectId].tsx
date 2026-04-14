// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\preview\[projectId].tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, DEFAULT_BPM, LOCAL_RENDER_ENABLED } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { CreateFlowState } from '@/types';

const initialDraft: CreateFlowState = {
  photos: [],
  useDefaultMusic: true,
  bpm: DEFAULT_BPM,
  format: 'portrait',
  style: 'fast',
  titleText: '',
  watermark: null,
  audio: null,
};

export default function PreviewScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const [draft, setDraft] = useState<CreateFlowState>(initialDraft);

  useEffect(() => {
    AsyncStorage.getItem(CREATE_DRAFT_KEY)
      .then((rawValue) => {
        const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;
        setDraft(parsed);
      })
      .catch(() => setDraft(initialDraft));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Project ready</Text>
        <Text style={styles.subtitle}>
          Project ID: {projectId ?? 'Not available'}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.row}>Photos: {draft.photos.length}</Text>
        <Text style={styles.row}>Song: {draft.audio?.fileName ?? 'No song selected'}</Text>
        <Text style={styles.row}>Format: {draft.format}</Text>
        <Text style={styles.row}>Style: {draft.style}</Text>
        <Text style={styles.row}>BPM: {draft.bpm ?? DEFAULT_BPM}</Text>
        <Text style={styles.row}>Title: {draft.titleText || 'No title'}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Local export status</Text>
        <Text style={styles.subtitle}>
          {LOCAL_RENDER_ENABLED
            ? 'On-device renderer is enabled.'
            : 'The app has been moved away from server rendering. The next step is wiring the native on-device encoder package.'}
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button label="Back to Dashboard" onPress={() => router.replace('/(app)')} />
        <Button label="Back to Options" onPress={() => router.replace('/(app)/create/options')} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    justifyContent: 'center',
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
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  row: {
    color: colors.text,
    fontSize: typography.body,
  },
  actions: {
    gap: spacing.sm,
  },
});