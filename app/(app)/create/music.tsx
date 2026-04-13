// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\create\music.tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import MusicPicker from '@/components/create/MusicPicker';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, DEFAULT_BPM } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { CreateFlowState, LocalMediaAsset } from '@/types';
import { validateBpm } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';

const bundledDefaultTrack = require('../../../assets/Golden Movieframe.mp3');

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

export default function MusicScreen() {
  const { showToast } = useToast();
  const [audio, setAudio] = useState<LocalMediaAsset | null>(null);
  const [useDefaultMusic, setUseDefaultMusic] = useState(true);
  const [bpm, setBpm] = useState(`${DEFAULT_BPM}`);
  const [bpmError, setBpmError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CREATE_DRAFT_KEY)
      .then((rawValue) => {
        const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;
        setAudio(parsed.audio ?? null);
        setUseDefaultMusic(parsed.useDefaultMusic ?? true);
        setBpm(`${parsed.bpm ?? DEFAULT_BPM}`);
      })
      .catch(() => undefined);
  }, []);

  const persist = async (partial: Partial<CreateFlowState>) => {
    const rawValue = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
    const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;

    const nextState: CreateFlowState = {
      ...initialDraft,
      ...parsed,
      ...partial,
    };

    await AsyncStorage.setItem(CREATE_DRAFT_KEY, JSON.stringify(nextState));
    setAudio(nextState.audio ?? null);
    setUseDefaultMusic(nextState.useDefaultMusic);
    setBpm(`${nextState.bpm ?? DEFAULT_BPM}`);
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const nextAudio: LocalMediaAsset = {
      uri: asset.uri,
      fileName: asset.name,
      mimeType: asset.mimeType ?? 'audio/mpeg',
      duration: null,
    };

    await persist({
      audio: nextAudio,
      useDefaultMusic: false,
    });

    showToast('Custom audio selected.', 'success');
  };

  const useBundledSong = async () => {
    const asset = Asset.fromModule(bundledDefaultTrack);
    if (!asset.localUri) {
      await asset.downloadAsync();
    }

    const nextAudio: LocalMediaAsset = {
      uri: asset.localUri ?? asset.uri,
      fileName: 'Golden Movieframe.mp3',
      mimeType: 'audio/mpeg',
      duration: null,
    };

    await persist({
      audio: nextAudio,
      useDefaultMusic: true,
    });

    showToast('Golden Movieframe selected as your built-in song.', 'success');
  };

  const handleNext = async () => {
    const nextBpmError = validateBpm(bpm);
    setBpmError(nextBpmError);

    if (nextBpmError) return;

    if (!audio) {
      showToast('Pick a song or use Golden Movieframe.', 'warning');
      return;
    }

    const numericBpm = bpm.trim() ? Number(bpm) : DEFAULT_BPM;
    if (!bpm.trim()) {
      showToast('No BPM entered. Defaulting to 120.', 'warning');
    }

    await persist({
      bpm: numericBpm || DEFAULT_BPM,
    });

    router.push('/(app)/create/options');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose music and tempo</Text>
      <Text style={styles.helperText}>
        You can use your built-in song “Golden Movieframe” or pick your own audio file.
      </Text>

      <MusicPicker
        audio={audio}
        useDefaultMusic={useDefaultMusic}
        onPick={pickAudio}
        onToggleDefault={(value) =>
          persist({
            useDefaultMusic: value,
            audio: value ? audio : audio,
          })
        }
      />

      <View style={styles.choiceButtons}>
        <Button label="Use Golden Movieframe" onPress={useBundledSong} variant="secondary" />
        <Button label="Pick My Own Song" onPress={pickAudio} variant="ghost" />
      </View>

      <Input
        label="BPM"
        value={bpm}
        onChangeText={setBpm}
        error={bpmError}
        keyboardType="numeric"
        placeholder="120"
      />

      <Text style={styles.helperText}>
        If you leave BPM empty, the app uses 120 for the slideshow timing.
      </Text>

      <View style={styles.actions}>
        <Button label="Back" onPress={() => router.back()} variant="ghost" />
        <Button label="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  choiceButtons: {
    gap: spacing.sm,
  },
  actions: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});