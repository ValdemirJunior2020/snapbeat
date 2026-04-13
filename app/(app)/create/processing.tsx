// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\create\processing.tsx
import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, DEFAULT_BPM } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { useRender } from '@/hooks/useRender';
import { useToast } from '@/hooks/useToast';
import { createProject, updateProject } from '@/services/firestore.service';
import { createRenderJob } from '@/services/render.service';
import { uploadManyAssets, uploadSingleAsset } from '@/services/storage.service';
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
  const { user } = useAuth();
  const { showToast } = useToast();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [localStatus, setLocalStatus] = useState('Preparing project…');
  const [isStarting, setIsStarting] = useState(true);

  const { job } = useRender(jobId, Boolean(jobId));

  const computedProgress = useMemo(() => {
    if (job) {
      return Math.max(localProgress, Math.min(100, 25 + Math.round(job.progress * 0.75)));
    }
    return localProgress;
  }, [job, localProgress]);

  const computedStatus = useMemo(() => {
    if (!job) return localStatus;
    if (job.status === 'pending') return 'Generating slideshow…';
    if (job.status === 'processing' && job.progress < 50) return 'Adding music…';
    if (job.status === 'processing' && job.progress >= 50) return 'Finalizing…';
    if (job.status === 'complete') return 'Video complete.';
    if (job.status === 'error') return job.error ?? 'Rendering failed.';
    return localStatus;
  }, [job, localStatus]);

  useEffect(() => {
    if (job?.status === 'complete' && projectId) {
      AsyncStorage.removeItem(CREATE_DRAFT_KEY).catch(() => undefined);
      showToast('Video ready.', 'success');
      router.replace(`/(app)/preview/${projectId}`);
    }

    if (job?.status === 'error') {
      setErrorMessage(job.error ?? 'Render failed.');
    }
  }, [job, projectId, showToast]);

  useEffect(() => {
    let isMounted = true;

    const startProcessing = async () => {
      if (!user?.uid) {
        setErrorMessage('You must be signed in to render videos.');
        setIsStarting(false);
        return;
      }

      try {
        setIsStarting(true);
        setErrorMessage(null);

        const rawValue = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
        const draft: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;

        if (!draft.photos.length) {
          throw new Error('No photos were found in the draft.');
        }

        if (!draft.audio) {
          throw new Error('No audio was selected.');
        }

        setLocalStatus('Creating project in Firestore…');
        setLocalProgress(5);

        const nextProjectId = await createProject({
          userId: user.uid,
          title: draft.titleText.trim() || 'Untitled Video',
          style: draft.style,
          format: draft.format,
          bpm: draft.bpm ?? DEFAULT_BPM,
          photoCount: draft.photos.length,
          audioName: draft.audio.fileName ?? 'Selected audio',
          status: 'uploading',
        });

        if (!isMounted) return;

        setProjectId(nextProjectId);
        setLocalStatus('Uploading photos…');
        setLocalProgress(10);

        const photoUrls = await uploadManyAssets(user.uid, draft.photos, 'photos');

        setLocalStatus('Uploading audio…');
        const audioUrl = await uploadSingleAsset(user.uid, draft.audio, 'audio');

        let watermarkUrl: string | undefined;
        if (draft.watermark) {
          setLocalStatus('Uploading watermark…');
          watermarkUrl = await uploadSingleAsset(user.uid, draft.watermark, 'watermarks');
        }

        setLocalProgress(25);
        setLocalStatus('Submitting render job…');

        const renderResponse = await createRenderJob({
          photos: photoUrls,
          audioUrl,
          format: draft.format,
          style: draft.style,
          bpm: draft.bpm ?? DEFAULT_BPM,
          titleText: draft.titleText.trim() || undefined,
          watermarkUrl,
          userId: user.uid,
          projectId: nextProjectId,
        });

        await updateProject(nextProjectId, {
          status: 'pending',
          renderJobId: renderResponse.jobId,
          watermarkUrl,
        });

        if (!isMounted) return;
        setJobId(renderResponse.jobId);
      } catch (error: any) {
        setErrorMessage(error?.message ?? 'Processing failed.');
      } finally {
        if (isMounted) {
          setIsStarting(false);
        }
      }
    };

    startProcessing();

    return () => {
      isMounted = false;
    };
  }, [showToast, user?.uid]);

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Rendering your video</Text>
        <Text style={styles.subtitle}>{computedStatus}</Text>
        <ProgressBar progress={computedProgress} />
        <Text style={styles.progressText}>{computedProgress}%</Text>
      </Card>

      {errorMessage ? (
        <Card style={styles.card}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Button label="Retry" onPress={() => router.replace('/(app)/create/processing')} />
          <Button label="Back to Options" onPress={() => router.replace('/(app)/create/options')} variant="ghost" />
        </Card>
      ) : null}

      {!errorMessage && isStarting ? (
        <Text style={styles.note}>Please keep the app open until the render finishes.</Text>
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
  note: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: 'center',
  },
});