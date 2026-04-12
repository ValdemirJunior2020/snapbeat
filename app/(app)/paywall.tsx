// FILE: app/(app)/paywall.tsx
import React from 'react';
import { Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { PRIVACY_URL, TERMS_URL } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/useToast';

export default function PaywallScreen() {
  const { displayPrice, isPurchasing, purchase, restore, error } = usePurchases();
  const { showToast } = useToast();

  const handlePurchase = async () => {
    const result = await purchase();
    if (result === 'success') {
      showToast('Unlimited exports unlocked.', 'success');
      router.back();
    } else if (result === 'cancelled') {
      showToast('Purchase cancelled.', 'warning');
    } else {
      showToast('Unable to complete purchase.', 'error');
    }
  };

  const handleRestore = async () => {
    const restored = await restore();
    showToast(restored ? 'Purchases restored.' : 'No purchases found.', restored ? 'success' : 'warning');
    if (restored) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Unlock Unlimited Exports</Text>
        <Text style={styles.subtitle}>One purchase. Unlimited MP4 exports forever.</Text>
      </View>

      <View style={styles.benefits}>
        <Text style={styles.bullet}>• Export finished videos without limits</Text>
        <Text style={styles.bullet}>• Share to Instagram or any app</Text>
        <Text style={styles.bullet}>• Keep your unlock forever on this Apple ID</Text>
      </View>

      <Text style={styles.price}>{displayPrice} — One-time purchase</Text>

      <View style={styles.actions}>
        <Button label="Unlock Now" onPress={handlePurchase} loading={isPurchasing} />
        <Button label="Restore Purchases" onPress={handleRestore} variant="secondary" loading={isPurchasing} />
        <Button label="Not now" onPress={() => router.back()} variant="ghost" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footerLinks}>
        <Text style={styles.smallLink} onPress={() => Linking.openURL(PRIVACY_URL)}>
          Privacy Policy
        </Text>
        <Text style={styles.smallLink} onPress={() => Linking.openURL(TERMS_URL)}>
          Terms of Use
        </Text>
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
    gap: spacing.md
  },
  hero: {
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center'
  },
  benefits: {
    gap: spacing.xs
  },
  bullet: {
    color: colors.text,
    fontSize: typography.body,
    textAlign: 'center'
  },
  price: {
    color: colors.accent,
    fontSize: typography.heading2,
    fontWeight: '800',
    textAlign: 'center'
  },
  actions: {
    gap: spacing.sm
  },
  error: {
    color: colors.error,
    textAlign: 'center'
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md
  },
  smallLink: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textDecorationLine: 'underline'
  }
});
