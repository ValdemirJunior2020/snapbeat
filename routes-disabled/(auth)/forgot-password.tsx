// FILE: app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { sendPasswordReset } from '@/services/auth.service';
import { validateEmail } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';

export default function ForgotPasswordScreen() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);

    if (nextEmailError) return;

    try {
      setIsLoading(true);
      await sendPasswordReset(email);
      showToast('Password reset email sent.', 'success');
      router.back();
    } catch (error: any) {
      showToast(error?.message ?? 'Unable to send reset email.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>Enter your email address and we will send reset instructions.</Text>

          <Card style={styles.card}>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              placeholder="you@example.com"
            />
            <Button label="Send Reset Email" onPress={handleReset} loading={isLoading} />
            <Button label="Back to Login" onPress={() => router.back()} variant="ghost" />
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  card: {
    gap: spacing.sm
  }
});
