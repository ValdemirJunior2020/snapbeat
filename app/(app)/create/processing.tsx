// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\create\processing.tsx
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, DEFAULT_BPM, MIN_PHOTOS } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { createProject } from '@/services/firestore.service';
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

export default function ProcessingScreen() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing your local project…');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        if (!user?.uid) {
          throw new Error('You must be signed in to continue.');
        }

        const rawValue = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
        const draft: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;

        if (draft.photos.length < MIN_PHOTOS) {
          throw new Error(`Please select at least ${MIN_PHOTOS} photos.`);
        }

        if (!draft.audio) {
          throw new Error('Please choose a song before continuing.');
        }

        if (!isMounted) return;
        setStatus('Saving project details…');
        setProgress(25);

        const projectId = await createProject({
          userId: user.uid,
          title: draft.titleText.trim() || 'Untitled Video',
          style: draft.style,
          format: draft.format,
          bpm: draft.bpm ?? DEFAULT_BPM,
          photoCount: draft.photos.length,
          audioName: draft.audio.fileName ?? 'Selected audio',
          status: 'draft',
        });

        if (!isMounted) return;
        setStatus('Preparing local export flow…');
        setProgress(75);

        if (!isMounted) return;
        setStatus('Ready for on-device renderer');
        setProgress(100);

        showToast('Project saved. The app is now on the local-render path.', 'success');
        router.replace(`/(app)/preview/${projectId}`);
      } catch (error: any) {
        setErrorMessage(error?.message ?? 'Unable to prepare project.');
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [showToast, user?.uid]);

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Preparing your project</Text>
        <Text style={styles.subtitle}>{status}</Text>
        <ProgressBar progress={progress} />
        <Text style={styles.progressText}>{progress}%</Text>
      </Card>

      {errorMessage ? (
        <Card style={styles.card}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Button label="Back to Options" onPress={() => router.replace('/(app)/create/options')} />
        </Card>
      ) : null}
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
  },
  progressText: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
    textAlign: 'right',
  },
  errorTitle: {
    color: colors.error,
    fontSize: typography.body,
    fontWeight: '800',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});