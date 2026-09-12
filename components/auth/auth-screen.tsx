import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

export function AuthScreen() {
  const { configured, signIn, signUp } = useSession();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMessage(null);
    const normalizedEmail = email.trim().toLowerCase();
    const error =
      mode === 'sign-in'
        ? await signIn(normalizedEmail, password)
        : await signUp(normalizedEmail, password);
    setBusy(false);
    setMessage(
      error ??
        (mode === 'sign-up'
          ? 'Account created. If email confirmation is enabled, check your inbox before signing in.'
          : null),
    );
  }

  const disabled = busy || !email.trim() || password.length < 6 || !configured;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>FOREX FOUNDATIONS</Text>
        <Text style={styles.title}>{mode === 'sign-in' ? 'Welcome back' : 'Create your learner account'}</Text>
        <Text style={styles.subtitle}>Learn forex step by step. No signals. No hype. Just structured education.</Text>

        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete={mode === 'sign-in' ? 'password' : 'new-password'}
          onChangeText={setPassword}
          placeholder="Password (6+ characters)"
          placeholderTextColor={colors.mutedText}
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {!configured ? (
          <Text style={styles.warning}>Authentication needs EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.</Text>
        ) : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Pressable disabled={disabled} onPress={submit} style={[styles.button, disabled && styles.buttonDisabled]}>
          {busy ? <ActivityIndicator /> : <Text style={styles.buttonText}>{mode === 'sign-in' ? 'Sign in' : 'Create account'}</Text>}
        </Pressable>

        <Pressable onPress={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setMessage(null); }}>
          <Text style={styles.switchText}>
            {mode === 'sign-in' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  card: { gap: 14, borderRadius: 24, padding: 24, backgroundColor: colors.surface },
  eyebrow: { color: colors.accent, fontWeight: '800', letterSpacing: 1.4, fontSize: 12 },
  title: { color: colors.mainText, fontSize: 30, lineHeight: 36, fontWeight: '800' },
  subtitle: { color: colors.mutedText, fontSize: 15, lineHeight: 22, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#25364F', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, color: colors.mainText, backgroundColor: colors.background },
  warning: { color: colors.accent, lineHeight: 20 },
  message: { color: colors.mutedText, lineHeight: 20 },
  button: { minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: '#06111C', fontWeight: '800', fontSize: 16 },
  switchText: { color: colors.primary, textAlign: 'center', fontWeight: '700', paddingVertical: 4 },
});
