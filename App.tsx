import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from './components/mvp/auth-screen';
import { LearnerMvp } from './components/mvp/learner-mvp';
import { LearnerDataProvider } from './src/learner-data-context';
import { SessionProvider, useSession } from './src/session-context';
import { colors } from './src/theme';

function AppGate() {
  const { configured, loading, session } = useSession();
  if (loading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.copy}>Restoring your session…</Text></View>;
  if (configured && !session) return <AuthScreen />;
  return <LearnerDataProvider><LearnerMvp /></LearnerDataProvider>;
}

export default function App() {
  return <SessionProvider><StatusBar style="light" /><AppGate /></SessionProvider>;
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background }, copy: { color: colors.mutedText } });
