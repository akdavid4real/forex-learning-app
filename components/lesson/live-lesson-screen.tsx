import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCourseSelection } from '../../src/course-selection-context';
import { useLiveLearner } from '../../src/use-live-learner';
import { getLesson, type Lesson } from '../../src/services/forex-api';
import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

export function LiveLessonScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { lesson: selectedLesson } = useCourseSelection();
  const { session } = useSession();
  const { completeLesson, isBookmarked, toggleBookmark } = useLiveLearner();
  const [lesson, setLesson] = useState<Lesson | null>(selectedLesson);
  const [loading, setLoading] = useState(Boolean(selectedLesson && session?.access_token));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLesson || !session?.access_token) return;
    let active = true;
    getLesson(session.access_token, selectedLesson.id)
      .then(({ lesson: loaded }) => { if (active) setLesson(loaded); })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : 'Unable to load lesson.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedLesson, session?.access_token]);

  if (loading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading lesson…</Text></View>;
  if (!lesson) return <View style={styles.center}><Text style={styles.title}>No lesson selected</Text><Pressable onPress={onBack}><Text style={styles.link}>Back to roadmap</Text></Pressable></View>;

  const content = lesson.content as Record<string, unknown> | string | null;
  const summary = typeof content === 'string'
    ? content
    : typeof content?.summary === 'string'
      ? content.summary
      : 'Work through this lesson carefully, then complete it to continue.';

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      await completeLesson(lesson.id);
      onNext();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to complete lesson.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack}><Text style={styles.link}>‹ Roadmap</Text></Pressable>
        <Pressable onPress={() => void toggleBookmark(lesson.id)}><Text style={styles.link}>{isBookmarked(lesson.id) ? '★ Saved' : '☆ Save'}</Text></Pressable>
      </View>
      <Text style={styles.eyebrow}>LESSON {lesson.position}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.meta}>{lesson.estimated_minutes} minute lesson</Text>

      <View style={styles.contentCard}>
        <Text style={styles.body}>{summary}</Text>
      </View>

      <View style={styles.takeaway}>
        <Text style={styles.takeawayTitle}>Key takeaway</Text>
        <Text style={styles.body}>Understand the idea well enough to explain it in your own words before moving on.</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable disabled={busy} onPress={() => void finish()} style={[styles.button, busy && styles.disabled]}>
        {busy ? <ActivityIndicator /> : <Text style={styles.buttonText}>Complete lesson</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 14 },
  center: { padding: 30, alignItems: 'center', gap: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: colors.primary, fontWeight: '800' },
  eyebrow: { color: colors.accent, fontWeight: '800', letterSpacing: 1.2, fontSize: 12, marginTop: 8 },
  title: { color: colors.mainText, fontSize: 30, lineHeight: 36, fontWeight: '800' },
  meta: { color: colors.mutedText },
  muted: { color: colors.mutedText },
  contentCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20 },
  body: { color: colors.mainText, fontSize: 16, lineHeight: 25 },
  takeaway: { borderRadius: 18, padding: 18, backgroundColor: '#2A2414', gap: 8 },
  takeawayTitle: { color: colors.accent, fontWeight: '800', fontSize: 16 },
  error: { color: '#FCA5A5' },
  button: { minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  disabled: { opacity: 0.55 },
  buttonText: { color: '#06111C', fontWeight: '900', fontSize: 16 },
});
