// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\create\processing.tsx
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, DEFAULT_BPM, MIN_PHOTOS } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { createProject, updateProject } from '@/services/firestore.service';
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

function getExtension(fileName?: string | null, fallback = 'jpg') {
  if (!fileName) return fallback;
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : fallback;
}

function getOutputSize(format: CreateFlowState['format']) {
  if (format === 'landscape') return { width: 1280, height: 720 };
  if (format === 'square') return { width: 1080, height: 1080 };
  return { width: 1080, height: 1920 };
}

function escapePath(path: string) {
  return path.replace(/'/g, "'\\''");
}

async function runFfmpeg(command: string) {
  return new Promise<void>((resolve, reject) => {
    FFmpegKit.executeAsync(command, async (session) => {
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        resolve();
        return;
      }

      const logs = await session.getAllLogsAsString();
      reject(new Error(logs || 'FFmpeg render failed.'));
    });
  });
}

export default function ProcessingScreen() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing local render…');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      let projectId: string | null = null;

      try {
        if (!user?.uid) {
          throw new Error('You must be signed in to continue.');
        }

        const rawValue = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
        const draft: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;

        if (draft.photos.length < MIN_PHOTOS) {
          throw new Error(`Please select at least ${MIN_PHOTOS} photos.`);
        }

        if (!draft.audio?.uri) {
          throw new Error('Please choose a song before continuing.');
        }

        const bpm = draft.bpm ?? DEFAULT_BPM;
        const secondsPerSlide = Math.max(1, (60 / bpm) * 2);
        const { width, height } = getOutputSize(draft.format);

        if (!isMounted) return;
        setStatus('Saving project…');
        setProgress(10);

        projectId = await createProject({
          userId: user.uid,
          title: draft.titleText.trim() || 'Untitled Video',
          style: draft.style,
          format: draft.format,
          bpm,
          photoCount: draft.photos.length,
          audioName: draft.audio.fileName ?? 'Selected audio',
          status: 'rendering',
        });

        const workDir = `${FileSystem.cacheDirectory}snapbeat-${Date.now()}/`;
        await FileSystem.makeDirectoryAsync(workDir, { intermediates: true });

        if (!isMounted) return;
        setStatus('Preparing photos…');
        setProgress(25);

        const preparedPhotos: string[] = [];
        for (let i = 0; i < draft.photos.length; i += 1) {
          const photo = draft.photos[i];
          const ext = getExtension(photo.fileName, 'jpg');
          const target = `${workDir}photo-${String(i + 1).padStart(3, '0')}.${ext}`;
          await FileSystem.copyAsync({
            from: photo.uri,
            to: target,
          });
          preparedPhotos.push(target);
        }

        const audioExt = getExtension(draft.audio.fileName, 'm4a');
        const audioPath = `${workDir}audio.${audioExt}`;
        await FileSystem.copyAsync({
          from: draft.audio.uri,
          to: audioPath,
        });

        let watermarkPath: string | null = null;
        if (draft.watermark?.uri) {
          const watermarkExt = getExtension(draft.watermark.fileName, 'png');
          watermarkPath = `${workDir}watermark.${watermarkExt}`;
          await FileSystem.copyAsync({
            from: draft.watermark.uri,
            to: watermarkPath,
          });
        }

        const concatFilePath = `${workDir}slides.txt`;
        const concatLines: string[] = [];

        preparedPhotos.forEach((photoPath) => {
          concatLines.push(`file '${escapePath(photoPath)}'`);
          concatLines.push(`duration ${secondsPerSlide}`);
        });

        concatLines.push(`file '${escapePath(preparedPhotos[preparedPhotos.length - 1])}'`);

        await FileSystem.writeAsStringAsync(concatFilePath, concatLines.join('\n'));

        const outputPath = `${workDir}output.mp4`;

        if (!isMounted) return;
        setStatus('Rendering on this phone…');
        setProgress(55);

        let command = '';

        if (watermarkPath) {
          command = [
            '-y',
            `-f concat -safe 0 -i "${concatFilePath}"`,
            `-i "${audioPath}"`,
            `-i "${watermarkPath}"`,
            `-filter_complex "[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black[base];[2:v]scale=180:-1[wm];[base][wm]overlay=W-w-24:24[v]"`,
            '-map "[v]"',
            '-map 1:a',
            '-r 30',
            '-c:v mpeg4',
            '-q:v 4',
            '-pix_fmt yuv420p',
            '-c:a aac',
            '-shortest',
            `"${outputPath}"`,
          ].join(' ');
        } else {
          command = [
            '-y',
            `-f concat -safe 0 -i "${concatFilePath}"`,
            `-i "${audioPath}"`,
            `-vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black"`,
            '-map 0:v',
            '-map 1:a',
            '-r 30',
            '-c:v mpeg4',
            '-q:v 4',
            '-pix_fmt yuv420p',
            '-c:a aac',
            '-shortest',
            `"${outputPath}"`,
          ].join(' ');
        }

        await runFfmpeg(command);

        if (!isMounted) return;
        setStatus('Finishing…');
        setProgress(95);

        await updateProject(projectId, {
          status: 'complete',
          localVideoUri: outputPath,
        } as any);

        setProgress(100);
        showToast('Video rendered on your phone.', 'success');
        router.replace(`/(app)/preview/${projectId}?videoUri=${encodeURIComponent(outputPath)}`);
      } catch (error: any) {
        if (projectId) {
          await updateProject(projectId, {
            status: 'error',
            errorMessage: error?.message ?? 'Local render failed.',
          } as any).catch(() => undefined);
        }

        setErrorMessage(error?.message ?? 'Unable to render video on this phone.');
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
        <Text style={styles.title}>Rendering on your phone</Text>
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