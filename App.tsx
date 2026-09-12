import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { AuthScreen } from './components/auth/auth-screen';
import { HomeDashboard } from './components/dashboard/home-dashboard';
import { CurrencyPairsLesson } from './components/lesson/currency-pairs-lesson';
import { AppTabBar, type AppTab } from './components/navigation/app-tab-bar';
import { LearningProgress } from './components/progress/learning-progress';
import { LearnerProfile } from './components/profile/learner-profile';
import { CurrencyPairsQuiz } from './components/quiz/currency-pairs-quiz';
import { CourseRoadmap } from './components/roadmap/course-roadmap';
import { LearnerDataProvider, useLearnerData } from './src/learner-data-context';
import { SessionProvider, useSession } from './src/session-context';
import { colors } from './src/theme';

type AppScreen = AppTab | 'lesson' | 'quiz';

function LearnerApp() {
  const { configured, loading: sessionLoading, session } = useSession();
  const { error, loading, refresh } = useLearnerData();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [currencyPairsComplete, setCurrencyPairsComplete] = useState(false);
  const showTabBar = currentScreen !== 'lesson' && currentScreen !== 'quiz';

  if (sessionLoading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Restoring your session…</Text></View>;
  }

  if (configured && !session) return <AuthScreen />;

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading your learning path…</Text></View>;
  }

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void refresh()}><Text style={styles.retry}>Retry</Text></Pressable>
        </View>
      ) : null}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        {currentScreen === 'home' ? <HomeDashboard onContinue={() => setCurrentScreen('roadmap')} /> : null}
        {currentScreen === 'roadmap' ? (
          <CourseRoadmap
            currencyPairsComplete={currencyPairsComplete}
            onBack={() => setCurrentScreen('home')}
            onStartModule={() => setCurrentScreen('lesson')}
          />
        ) : null}
        {currentScreen === 'lesson' ? <CurrencyPairsLesson onBack={() => setCurrentScreen('roadmap')} onNext={() => setCurrentScreen('quiz')} /> : null}
        {currentScreen === 'quiz' ? (
          <CurrencyPairsQuiz
            onBack={() => setCurrentScreen('lesson')}
            onComplete={() => {
              setCurrencyPairsComplete(true);
              void refresh();
              setCurrentScreen('roadmap');
            }}
          />
        ) : null}
        {currentScreen === 'progress' ? <LearningProgress /> : null}
        {currentScreen === 'profile' ? <LearnerProfile /> : null}
      </ScrollView>
      {showTabBar ? <AppTabBar activeTab={currentScreen} onTabChange={setCurrentScreen} /> : null}
    </View>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <LearnerDataProvider>
        <LearnerApp />
      </LearnerDataProvider>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: colors.background },
  muted: { color: colors.mutedText },
  content: { flexGrow: 1 },
  scrollView: { flex: 1 },
  errorBanner: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#3A1D25', flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' },
  errorText: { color: '#FCA5A5', flex: 1 },
  retry: { color: colors.mainText, fontWeight: '800' },
});
