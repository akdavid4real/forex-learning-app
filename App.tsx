import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppErrorBoundary } from './components/common/app-error-boundary';
import { AuthScreen } from './components/mvp/auth-screen';
import { LearnerMvp } from './components/mvp/learner-mvp';
import { LearnerDataProvider, useLearnerData } from './src/learner-data-context';
import { SessionProvider, useSession } from './src/session-context';
import { colors } from './src/theme';

function LearnerAccessGate() {
  const { error, loading, profile, refresh } = useLearnerData();
  const { signOut } = useSession();

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.copy}>Loading your learner account…</Text></View>;
  }

  if (error && !profile) {
    return <View style={styles.center}><Text style={styles.title}>Unable to load your account</Text><Text style={styles.copy}>{error}</Text><Pressable style={styles.primary} onPress={() => void refresh()}><Text style={styles.primaryText}>Try again</Text></Pressable></View>;
  }

  if (profile?.access_status === 'pending') {
    return <View style={styles.center}><Text style={styles.eyebrow}>ACCESS PENDING</Text><Text style={styles.title}>Your enrollment is awaiting approval.</Text><Text style={styles.copy}>Once your payment has been verified, your learning access will be activated. You can sign back in later with this same account.</Text><Pressable style={styles.primary} onPress={() => void refresh()}><Text style={styles.primaryText}>Check again</Text></Pressable><Pressable style={styles.secondary} onPress={() => void signOut()}><Text style={styles.secondaryText}>Sign out</Text></Pressable></View>;
  }

  if (profile?.access_status === 'suspended') {
    return <View style={styles.center}><Text style={styles.eyebrow}>ACCESS SUSPENDED</Text><Text style={styles.title}>Your learner access is currently unavailable.</Text><Text style={styles.copy}>Contact the Forex Learning team if you believe this status is incorrect.</Text><Pressable style={styles.secondary} onPress={() => void signOut()}><Text style={styles.secondaryText}>Sign out</Text></Pressable></View>;
  }

  return <LearnerMvp />;
}

function AppGate() {
  const { configured, loading, recoveryMode, session } = useSession();
  if (loading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.copy}>Restoring your session…</Text></View>;
  if (recoveryMode) return <AuthScreen />;
  if (configured && !session) return <AuthScreen />;
  return <LearnerDataProvider><LearnerAccessGate /></LearnerDataProvider>;
}

export default function App() {
  return (
    <AppErrorBoundary>
      <SessionProvider>
        <StatusBar style="light" />
        <AppGate />
      </SessionProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.background, padding: 28 },
  eyebrow: { color: colors.accent, fontWeight: '900', letterSpacing: 1.5, fontSize: 12, textAlign: 'center' },
  title: { color: colors.mainText, fontSize: 28, lineHeight: 35, fontWeight: '900', textAlign: 'center', maxWidth: 520 },
  copy: { color: colors.mutedText, textAlign: 'center', lineHeight: 22, maxWidth: 520 },
  primary: { backgroundColor: colors.primary, borderRadius: 12, minWidth: 180, paddingHorizontal: 20, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: colors.background, fontWeight: '900' },
  secondary: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, minWidth: 180, paddingHorizontal: 20, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: colors.mainText, fontWeight: '800' },
});
