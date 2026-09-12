import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

export function AuthScreen() {
  const { signIn, signUp } = useSession();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || password.length < 6) {
      setMessage('Enter a valid email and a password of at least 6 characters.');
      return;
    }
    setBusy(true);
    setMessage(null);
    const error = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (error) setMessage(error);
    else if (mode === 'signup') {
      setMessage('Account created. Confirm your email if requested. Learning access remains pending until your enrollment/payment is approved.');
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>FOREX LEARNING</Text>
        <Text style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Create your learner account'}</Text>
        <Text style={styles.copy}>
          {mode === 'signin'
            ? 'Sign in to continue your approved learning path.'
            : 'Use the same email you used for enrollment. New accounts remain pending until the team approves access.'}
        </Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.mutedText} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.mutedText} secureTextEntry style={styles.input} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable onPress={() => void submit()} disabled={busy} style={styles.primary}>{busy ? <ActivityIndicator /> : <Text style={styles.primaryText}>{mode === 'signin' ? 'Sign in' : 'Create pending account'}</Text>}</Pressable>
        <Pressable onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null); }}><Text style={styles.switchText}>{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</Text></Pressable>
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
  switchText: { color: colors.mainText, textAlign: 'center', fontWeight: '700', paddingVertical: 8 },
  message: { color: '#FCA5A5', lineHeight: 20 },
});
