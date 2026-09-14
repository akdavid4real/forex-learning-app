import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useLearnerData } from '../../src/learner-data-context';
import { updateCurrentUser } from '../../src/services/forex-api';
import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

export function ProfileSettingsScreen({ onBack }: { onBack: () => void }) {
  const { profile, refresh } = useLearnerData();
  const { session } = useSession();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => setDisplayName(profile?.display_name ?? ''), [profile?.display_name]);

  async function save() {
    const normalized = displayName.trim();
    if (normalized.length < 2 || normalized.length > 80) {
      setMessage('Display name must be between 2 and 80 characters.');
      return;
    }
    if (!session?.access_token) {
      setMessage('Sign in to update your profile.');
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      await updateCurrentUser(session.access_token, normalized);
      await refresh();
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update your profile.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.link}>← Profile</Text></Pressable>
      <Text style={styles.eyebrow}>ACCOUNT</Text>
      <Text style={styles.title}>Profile settings</Text>
      <Text style={styles.copy}>Choose the name shown in your learning experience.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Display name</Text>
        <TextInput
          autoCapitalize="words"
          maxLength={80}
          onChangeText={setDisplayName}
          placeholder="Your name"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          value={displayName}
        />
        <Text style={styles.email}>{session?.user.email}</Text>
      </View>

      {message ? <Text selectable style={styles.message}>{message}</Text> : null}
      <Pressable disabled={busy} onPress={() => void save()} style={[styles.primary, busy && styles.disabled]}>
        {busy ? <ActivityIndicator /> : <Text style={styles.primaryText}>Save changes</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 14 },
  link: { color: colors.primary, fontWeight: '900' },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.mainText, fontSize: 28, fontWeight: '900' },
  copy: { color: colors.mutedText, lineHeight: 21 },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, gap: 9 },
  label: { color: colors.mainText, fontWeight: '800' },
  input: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.mainText, paddingHorizontal: 14, paddingVertical: 13 },
  email: { color: colors.mutedText, fontSize: 12 },
  message: { color: colors.accent, lineHeight: 20 },
  primary: { backgroundColor: colors.primary, borderRadius: 14, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.background, fontWeight: '900' },
  disabled: { opacity: 0.55 },
});
