import { StyleSheet, Text, View } from 'react-native';
import { useLearnerData } from '../../src/learner-data-context';
import { colors } from '../../src/theme';

export function LiveLearningProgress() {
  const { achievements, currentCourse, profile, progress } = useLearnerData();
  const completed = progress.lessons.filter((item) => Boolean(item.completed_at)).length;
  const totalLessons = (currentCourse?.modules ?? []).reduce((sum, module) => sum + (module.lessons?.length ?? 0), 0);
  const percent = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>PROGRESS</Text>
      <Text style={styles.title}>Your learning momentum</Text>
      <Text style={styles.muted}>Small consistent sessions beat cramming. Keep moving through the roadmap in order.</Text>
      <View style={styles.hero}><Text style={styles.percent}>{percent}%</Text><Text style={styles.heroLabel}>course completion</Text></View>
      <View style={styles.grid}>
        <Metric label="Lessons complete" value={`${completed}/${totalLessons || '—'}`} />
        <Metric label="XP earned" value={String(profile?.xp ?? 0)} />
        <Metric label="Current streak" value={`${profile?.current_streak ?? 0} days`} />
        <Metric label="Achievements" value={String(achievements.length)} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 14 }, eyebrow: { color: colors.accent, fontWeight: '800', letterSpacing: 1.3, fontSize: 12 },
  title: { color: colors.mainText, fontWeight: '900', fontSize: 30, lineHeight: 36 }, muted: { color: colors.mutedText, lineHeight: 21 },
  hero: { backgroundColor: colors.surface, borderRadius: 22, padding: 22, alignItems: 'center' }, percent: { color: colors.primary, fontWeight: '900', fontSize: 46 }, heroLabel: { color: colors.mutedText, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, metric: { width: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, minHeight: 94, justifyContent: 'center' }, metricValue: { color: colors.mainText, fontWeight: '900', fontSize: 22 }, metricLabel: { color: colors.mutedText, marginTop: 4, fontSize: 12 },
});
