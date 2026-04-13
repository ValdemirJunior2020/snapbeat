// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\index.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';

export default function AppHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>BeatVideo Maker</Text>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          You are signed in. Use the buttons below to test the app safely.
        </Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Create</Text>
          <Text style={styles.cardText}>
            Start the video creation flow.
          </Text>
          <Button label="Create New Video" onPress={() => router.push('/(app)/create/photos')} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardText}>
            Open settings and account actions.
          </Text>
          <Button label="Open Settings" onPress={() => router.push('/(app)/settings')} variant="secondary" />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Paywall</Text>
          <Text style={styles.cardText}>
            Open the export unlock screen.
          </Text>
          <Button label="Open Paywall" onPress={() => router.push('/(app)/paywall')} variant="secondary" />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  card: {
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.heading2,
    fontWeight: '800',
  },
  cardText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});