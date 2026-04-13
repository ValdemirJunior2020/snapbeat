// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(auth)\login.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { spacing, typography } from '@/constants/styles';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const { showToast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    try {
      setIsLoading(true);
      await login(email, password);
      showToast('Welcome back.', 'success');
      router.replace('/(app)');
    } catch (error: any) {
      showToast(error?.message ?? 'Unable to sign in.', 'error');
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
          <Text style={styles.eyebrow}>BeatVideo Maker</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to create and export your slideshow videos.
          </Text>

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
              placeholder="••••••••"
              secureTextEntry
            />

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity activeOpacity={0.75}>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>

            <Button label="Log In" onPress={handleLogin} loading={isLoading} />
          </Card>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Need an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity activeOpacity={0.75}>
                <Text style={styles.link}>Create one</Text>
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
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typography.label,
    fontWeight: '700',
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
  },
  card: {
    gap: spacing.sm,
  },
  link: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  bottomText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});