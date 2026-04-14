// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\settings.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{user?.email ?? 'Unknown email'}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.info}>
          Purchases and advanced account actions are temporarily disabled while rendering is being stabilized.
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button label="Log Out" onPress={handleLogout} variant="ghost" />
        <Button label="Back" onPress={() => router.back()} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
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
  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  email: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  info: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
});