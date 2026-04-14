// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\settings.tsx
import React, { useState } from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { PRIVACY_URL, TERMS_URL } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/useToast';

export default function SettingsScreen() {
  const { user, logout, deleteCurrentUser } = useAuth();
  const { restore, loading } = usePurchases();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRestore = async () => {
    const restored = await restore();
    showToast(restored ? 'Purchases restored.' : 'No purchases found.', restored ? 'success' : 'warning');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete account',
      'This will delete your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteCurrentUser();
              showToast('Account deleted.', 'success');
              router.replace('/(auth)/login');
            } catch (error: any) {
              showToast(error?.message ?? 'Unable to delete account.', 'error');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{user?.email ?? 'Unknown email'}</Text>
      </Card>

      <View style={styles.section}>
        <Button label="Restore Purchases" onPress={handleRestore} loading={loading} variant="secondary" />
        <Button label="Privacy Policy" onPress={() => Linking.openURL(PRIVACY_URL)} variant="secondary" />
        <Button label="Terms of Use" onPress={() => Linking.openURL(TERMS_URL)} variant="secondary" />
      </View>

      <View style={styles.section}>
        <Button label="Log Out" onPress={handleLogout} variant="ghost" />
        <Button label="Delete Account" onPress={handleDelete} variant="danger" loading={isDeleting} />
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
    gap: spacing.xs,
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
  section: {
    gap: spacing.sm,
  },
});