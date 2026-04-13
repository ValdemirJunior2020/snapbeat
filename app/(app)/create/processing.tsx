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
import { checkEntitlement } from '@/services/purchases.service';
import { CreateFlowState, LocalMediaAsset } from '@/types';

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

function appendAsset(
  formData: FormData,
  fieldName: string,
  asset: LocalMediaAsset,
  fallbackName: string,
  fallbackType: string
) {
  const normalizedUri =
    asset.uri.startsWith('file://') || asset.uri.startsWith('content://')
      ? asset.uri
      : `file://${asset.uri}`;

  formData.append(fieldName, {
    uri: normalizedUri,
    name: asset.fileName || fallbackName,
    type: asset.mimeType || fallbackType,
  } as any);
}

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
      return Math.max(localProgress, Math.min(100, job.progress));
    }
    return localProgress;
  }, [job, localProgress]);

  const computedStatus = useMemo(() => {
    if (!job) return localStatus;
    if (job.status === 'pending') return 'Preparing render…';
    if (job.status === 'processing' && job.progress < 50) return 'Rendering slideshow…';
    if (job.status === 'processing' && job.progress >= 50) return 'Finalizing video…';
    if (job.status === 'complete') return 'Video complete.';
    if (job.status === 'error') return job.error ?? 'Rendering failed.';
    return localStatus;
  }, [job, localStatus]);

  useEffect(() => {
    if (job?.status === 'complete' && projectId && jobId) {
      AsyncStorage.removeItem(CREATE_DRAFT_KEY).catch(() => undefined);
      showToast('Video ready.', 'success');
      router.replace(`/(app)/preview/${projectId}?jobId=${jobId}`);
    }

    if (job?.status === 'error') {
      setErrorMessage(job.error ?? 'Render failed.');
    }
  }, [job, projectId, jobId, showToast]);

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

        if (draft.photos.length < 3) {
          throw new Error('Please select at least 3 photos.');
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
          status: 'pending',
        });

        if (!isMounted) return;
        setProjectId(nextProjectId);

        setLocalStatus('Uploading to render server…');
        setLocalProgress(10);

        const hasExportUnlock = await checkEntitlement();

        const formData = new FormData();
        formData.append('userId', user.uid);
        formData.append('projectId', nextProjectId);
        formData.append('format', draft.format);
        formData.append('style', draft.style);
        formData.append('bpm', String(draft.bpm ?? DEFAULT_BPM));
        formData.append('titleText', draft.titleText.trim() || '');
        formData.append('applyWatermark', String(!hasExportUnlock));

        draft.photos.forEach((photo, index) => {
          appendAsset(
            formData,
            'photos',
            photo,
            photo.fileName || `photo-${index + 1}.jpg`,
            photo.mimeType || 'image/jpeg'
          );
        });

        appendAsset(
          formData,
          'audio',
          draft.audio,
          draft.audio.fileName || 'audio-track.m4a',
          draft.audio.mimeType || 'audio/mpeg'
        );

        if (draft.watermark) {
          appendAsset(
            formData,
            'watermark',
            draft.watermark,
            draft.watermark.fileName || 'watermark.png',
            draft.watermark.mimeType || 'image/png'
          );
        }

        setLocalStatus('Submitting render job…');
        setLocalProgress(20);

        const renderResponse = await createRenderJob(formData);

        await updateProject(nextProjectId, {
          status: 'processing',
          renderJobId: renderResponse.jobId,
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
          <Button
            label="Back to Options"
            onPress={() => router.replace('/(app)/create/options')}
            variant="ghost"
          />
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