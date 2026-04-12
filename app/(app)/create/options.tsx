// FILE: app/(app)/create/options.tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import FormatPicker from '@/components/create/FormatPicker';
import StyleSelector from '@/components/create/StyleSelector';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { CREATE_DRAFT_KEY, DEFAULT_BPM } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { CreateFlowState, LocalMediaAsset, VideoFormat, VideoStyle } from '@/types';
import { validateTitle } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';

const initialDraft: CreateFlowState = {
  photos: [],
  useDefaultMusic: true,
  bpm: DEFAULT_BPM,
  format: 'portrait',
  style: 'fast',
  titleText: '',
  watermark: null,
  audio: null
};

export default function OptionsScreen() {
  const { showToast } = useToast();
  const [format, setFormat] = useState<VideoFormat>('portrait');
  const [style, setStyle] = useState<VideoStyle>('fast');
  const [titleText, setTitleText] = useState('');
  const [watermark, setWatermark] = useState<LocalMediaAsset | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CREATE_DRAFT_KEY)
      .then((rawValue) => {
        const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;
        setFormat(parsed.format ?? 'portrait');
        setStyle(parsed.style ?? 'fast');
        setTitleText(parsed.titleText ?? '');
        setWatermark(parsed.watermark ?? null);
      })
      .catch(() => undefined);
  }, []);

  const persist = async (partial: Partial<CreateFlowState>) => {
    const rawValue = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
    const parsed: CreateFlowState = rawValue ? JSON.parse(rawValue) : initialDraft;

    const nextState: CreateFlowState = {
      ...initialDraft,
      ...parsed,
      ...partial
    };

    await AsyncStorage.setItem(CREATE_DRAFT_KEY, JSON.stringify(nextState));

    setFormat(nextState.format);
    setStyle(nextState.style);
    setTitleText(nextState.titleText);
    setWatermark(nextState.watermark ?? null);
  };

  const pickWatermark = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Photo library permission is required to pick a watermark.', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: false
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    await persist({
      watermark: {
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height,
        duration: null
      }
    });
  };

  const handleGenerate = async () => {
    const nextTitleError = validateTitle(titleText);
    setTitleError(nextTitleError);
    if (nextTitleError) return;

    await persist({ format, style, titleText, watermark });
    router.push('/(app)/create/processing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Customize your video</Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Format</Text>
          <FormatPicker selectedFormat={format} onSelect={(value) => persist({ format: value })} />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Style</Text>
          <StyleSelector selectedStyle={style} onSelect={(value) => persist({ style: value })} />
        </Card>

        <Card style={styles.section}>
          <Input
            label="Optional title"
            value={titleText}
            onChangeText={(value) => {
              setTitleText(value);
              persist({ titleText: value });
            }}
            error={titleError}
            placeholder="Sunday Youth Retreat"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Watermark</Text>
          <Button
            label={watermark ? 'Change Watermark' : 'Pick Watermark'}
            onPress={pickWatermark}
            variant="secondary"
          />
          {watermark ? <Text style={styles.helper}>{watermark.fileName ?? 'Watermark selected'}</Text> : null}
        </Card>
      </ScrollView>

      <View style={styles.actions}>
        <Button label="Back" onPress={() => router.back()} variant="ghost" />
        <Button label="Generate Video" onPress={handleGenerate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md
  },
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  title: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800'
  },
  section: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.sm
  }
});
