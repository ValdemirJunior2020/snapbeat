// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\paywall.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';

export default function PaywallScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Paywall</Text>
        <Text style={styles.subtitle}>
          Purchase flow is temporarily disabled while rendering and export are being stabilized.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.bullet}>• Free exports will use a SnapBeat watermark</Text>
        <Text style={styles.bullet}>• Paid clean export will be restored next</Text>
      </Card>

      <View style={styles.actions}>
        <Button label="Back" onPress={() => router.back()} />
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
  bullet: {
    color: colors.text,
    fontSize: typography.body,
  },
  actions: {
    gap: spacing.sm,
  },
});