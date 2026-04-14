// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\paywall.tsx
import React from 'react';
import { Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { PRIVACY_URL, TERMS_URL } from '@/constants/config';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/useToast';

export default function PaywallScreen() {
  const { purchase, restore, loading } = usePurchases();
  const { showToast } = useToast();

  const handlePurchase = async () => {
    const result = await purchase();

    if (result === 'success') {
      showToast('Export unlock purchased.', 'success');
      router.back();
      return;
    }

    if (result === 'cancelled') {
      showToast('Purchase cancelled.', 'warning');
      return;
    }

    showToast('Unable to complete purchase.', 'error');
  };

  const handleRestore = async () => {
    const restored = await restore();
    showToast(restored ? 'Purchases restored.' : 'No purchases found.', restored ? 'success' : 'warning');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Unlock Unlimited Exports</Text>
        <Text style={styles.price}>$1.99 — One-time purchase</Text>

        <Card style={styles.card}>
          <Text style={styles.bullet}>• Export MP4 videos anytime</Text>
          <Text style={styles.bullet}>• Share your finished videos anywhere</Text>
          <Text style={styles.bullet}>• Pay once and keep it forever</Text>
        </Card>

        <Button label="Unlock Now" onPress={handlePurchase} loading={loading} />
        <Button label="Restore Purchases" onPress={handleRestore} loading={loading} variant="secondary" />
        <Button label="Not now" onPress={() => router.back()} variant="ghost" />

        <View style={styles.linksRow}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => Linking.openURL(PRIVACY_URL)}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.75} onPress={() => Linking.openURL(TERMS_URL)}>
            <Text style={styles.link}>Terms of Use</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800',
    textAlign: 'center',
  },
  price: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    gap: spacing.sm,
  },
  bullet: {
    color: colors.text,
    fontSize: typography.body,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  link: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});