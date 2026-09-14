import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

type Mode = 'signin' | 'signup' | 'forgot';

export function AuthScreen() {
  const { cancelRecovery, recoveryMode, requestPasswordReset, signIn, signUp, updatePassword } = useSession();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setMessage(null);

    if (recoveryMode) {
      if (password.length < 8) { setMessage('Use a new password of at least 8 characters.'); return; }
      if (password !== confirmPassword) { setMessage('The passwords do not match.'); return; }
      setBusy(true);
      const error = await updatePassword(password);
      setBusy(false);
      setMessage(error ?? 'Password updated. You can continue into your account.');
      return;
    }

    if (mode === 'forgot') {
      if (!email.trim()) { setMessage('Enter the email address for your account.'); return; }
      setBusy(true);
      const error = await requestPasswordReset(email);
      setBusy(false);
      setMessage(error ?? 'Password reset email sent. Open the link on this device to set a new password.');
      return;
    }

    if (!email.trim() || password.length < 8) {
      setMessage('Enter a valid email and a password of at least 8 characters.');
      return;
    }

    setBusy(true);
    const error = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (error) setMessage(error);
    else if (mode === 'signup') setMessage('Account created. Confirm your email if required, then sign in. Access stays pending until enrollment is approved.');
  }

  const title = recoveryMode ? 'Set a new password' : mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your learner account' : 'Reset your password';
  const buttonLabel = recoveryMode ? 'Update password' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link';

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>FOREX LEARNING</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.copy}>
          {recoveryMode
            ? 'Choose a new password for your learner account.'
            : mode === 'forgot'
              ? 'We will email you a secure link that opens the app and lets you choose a new password.'
              : 'Learn market structure, risk and execution with progress that follows you across devices.'}
        </Text>

        {!recoveryMode ? (
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.mutedText} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        ) : null}

        {mode !== 'forgot' || recoveryMode ? (
          <TextInput value={password} onChangeText={setPassword} placeholder={recoveryMode ? 'New password' : 'Password'} placeholderTextColor={colors.mutedText} secureTextEntry style={styles.input} />
        ) : null}

        {recoveryMode ? (
          <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm new password" placeholderTextColor={colors.mutedText} secureTextEntry style={styles.input} />
        ) : null}

        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable onPress={() => void submit()} disabled={busy} style={styles.primary}>
          {busy ? <ActivityIndicator /> : <Text style={styles.primaryText}>{buttonLabel}</Text>}
        </Pressable>

        {recoveryMode ? (
          <Pressable onPress={cancelRecovery}><Text style={styles.switchText}>Cancel password reset</Text></Pressable>
        ) : mode === 'signin' ? (
          <>
            <Pressable onPress={() => { setMode('forgot'); setMessage(null); }}><Text style={styles.switchText}>Forgot password?</Text></Pressable>
            <Pressable onPress={() => { setMode('signup'); setMessage(null); }}><Text style={styles.switchText}>New here? Create an account</Text></Pressable>
          </>
        ) : (
          <Pressable onPress={() => { setMode('signin'); setMessage(null); }}><Text style={styles.switchText}>Back to sign in</Text></Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 24, gap: 14 },
  eyebrow: { color: colors.primary, fontWeight: '900', letterSpacing: 1.4, fontSize: 12 },
  title: { color: colors.mainText, fontWeight: '900', fontSize: 30 },
  copy: { color: colors.mutedText, lineHeight: 21, marginBottom: 8 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: '#25344D', borderRadius: 14, color: colors.mainText, paddingHorizontal: 16, paddingVertical: 14 },
  primary: { backgroundColor: colors.primary, borderRadius: 14, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#06211F', fontWeight: '900', fontSize: 16 },
  switchText: { color: colors.mainText, textAlign: 'center', fontWeight: '700', paddingVertical: 6 },
  message: { color: '#FCA5A5', lineHeight: 20 },
});
