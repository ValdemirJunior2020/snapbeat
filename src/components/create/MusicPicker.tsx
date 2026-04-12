// FILE: src/components/create/MusicPicker.tsx
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { LocalMediaAsset } from '@/types';
import { formatDurationSeconds } from '@/utils/format';

interface MusicPickerProps {
  audio?: LocalMediaAsset | null;
  useDefaultMusic: boolean;
  onPick: () => void;
  onToggleDefault: (value: boolean) => void;
}

export default function MusicPicker({
  audio,
  useDefaultMusic,
  onPick,
  onToggleDefault
}: MusicPickerProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Use default music</Text>
        <Switch value={useDefaultMusic} onValueChange={onToggleDefault} />
      </View>

      {useDefaultMusic ? (
        <Text style={styles.note}>A built-in fallback track will be used for the render request.</Text>
      ) : (
        <>
          <Button label={audio ? 'Change audio file' : 'Pick audio file'} onPress={onPick} variant="secondary" />
          {audio ? (
            <View style={styles.meta}>
              <Text style={styles.fileName}>{audio.fileName ?? 'Picked audio file'}</Text>
              <Text style={styles.fileDetails}>{formatDurationSeconds(audio.duration)}</Text>
            </View>
          ) : (
            <Text style={styles.note}>Pick an mp3, m4a, or wav file.</Text>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  meta: {
    gap: 4
  },
  fileName: {
    color: colors.text,
    fontSize: typography.body
  },
  fileDetails: {
    color: colors.textMuted,
    fontSize: typography.caption
  }
});
