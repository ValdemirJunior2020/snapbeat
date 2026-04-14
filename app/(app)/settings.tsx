// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\settings.tsx
import React, { useContext, useState } from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { PRIVACY_URL, TERMS_URL } from '@/constants/config';
import { spacing, typography } from '@/constants/styles';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

export default function SettingsScreen() {
  const { user, logout, deleteCurrentUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      showToast('Unable to open link.', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will delete your account authentication record. If Firebase requires recent sign-in, you may need to log in again before deleting.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteCurrentUser();
              showToast('Account deleted.', 'success');
              router.replace('/(auth)/login');
            } catch (error: any) {
              showToast(
                error?.message ?? 'Unable to delete account. Please log in again and retry.',
                'error'
              );
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
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{user?.email ?? 'Unknown email'}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <Button label="Privacy Policy" onPress={() => handleOpenUrl(PRIVACY_URL)} variant="secondary" />
        <Button label="Terms of Use" onPress={() => handleOpenUrl(TERMS_URL)} variant="secondary" />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button label="Log Out" onPress={handleLogout} variant="ghost" />
        <Button label="Delete Account" onPress={handleDeleteAccount} loading={isDeleting} />
      </Card>

      <View style={styles.actions}>
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
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  actions: {
    gap: spacing.sm,
  },
});