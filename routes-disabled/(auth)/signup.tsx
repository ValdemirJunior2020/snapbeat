// FILE: app/(auth)/signup.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Link, router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { signUp } from '@/services/auth.service';
import { validateConfirmPassword, validateEmail, validatePassword } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';

export default function SignupScreen() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    const nextConfirmPasswordError = validateConfirmPassword(password, confirmPassword);

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);

    if (nextEmailError || nextPasswordError || nextConfirmPasswordError) return;

    try {
      setIsLoading(true);
      await signUp(email, password);
      showToast('Account created.', 'success');
      router.replace('/(app)');
    } catch (error: any) {
      showToast(error?.message ?? 'Unable to create account.', 'error');
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Save projects, render videos, and unlock exports forever.</Text>

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
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              placeholder="At least 6 characters"
              secureTextEntry
            />
            <Input
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              placeholder="Repeat password"
              secureTextEntry
            />
            <Button label="Create Account" onPress={handleSignup} loading={isLoading} />
          </Card>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity activeOpacity={0.75}>
                <Text style={styles.link}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
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
  },
  bottomRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center'
  },
  bottomText: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  link: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
