import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCourseSelection } from '../../src/course-selection-context';
import { useLiveLearner } from '../../src/use-live-learner';
import { getQuiz, type Quiz } from '../../src/services/forex-api';
import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

export function LiveQuizScreen({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const { quizId } = useCourseSelection();
  const { session } = useSession();
  const { submitQuiz } = useLiveLearner();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(Boolean(quizId && session?.access_token));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ passed: boolean; score: number; awarded_xp: number } | null>(null);

  useEffect(() => {
    if (!quizId || !session?.access_token) return;
    let active = true;
    getQuiz(session.access_token, quizId)
      .then(({ quiz: loaded }) => { if (active) setQuiz(loaded); })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : 'Unable to load quiz.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [quizId, session?.access_token]);

  const orderedQuestions = useMemo(() => [...(quiz?.quiz_questions ?? [])].sort((a, b) => a.position - b.position), [quiz]);
  const ready = orderedQuestions.length > 0 && orderedQuestions.every((question) => Number.isInteger(answers[question.id]));

  async function submit() {
    if (!quiz || !ready) return;
    setBusy(true);
    setError(null);
    try {
      const response = await submitQuiz(quiz.id, orderedQuestions.map((question) => answers[question.id]));
      if (response) setResult(response.attempt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to submit quiz.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading quiz…</Text></View>;
  if (!quiz) return <View style={styles.center}><Text style={styles.title}>No quiz selected</Text><Pressable onPress={onBack}><Text style={styles.link}>Back</Text></Pressable></View>;

  if (result) {
    return (
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>{result.passed ? 'PASSED' : 'KEEP LEARNING'}</Text>
        <Text style={styles.title}>{result.score}%</Text>
        <Text style={styles.body}>{result.passed ? `Great work. You earned ${result.awarded_xp} XP.` : `You need ${quiz.passing_score}% to pass. Review the lesson and try again.`}</Text>
        <Pressable onPress={result.passed ? onComplete : onBack} style={styles.button}>
          <Text style={styles.buttonText}>{result.passed ? 'Continue learning' : 'Review lesson'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.link}>‹ Back to lesson</Text></Pressable>
      <Text style={styles.eyebrow}>MODULE QUIZ</Text>
      <Text style={styles.title}>{quiz.title}</Text>
      <Text style={styles.muted}>Pass mark: {quiz.passing_score}%</Text>

      {orderedQuestions.map((question, questionIndex) => {
        const options = Array.isArray(question.answers) ? question.answers : [];
        return (
          <View key={question.id} style={styles.card}>
            <Text style={styles.question}>{questionIndex + 1}. {question.prompt}</Text>
            {options.map((option, optionIndex) => (
              <Pressable
                key={`${question.id}-${optionIndex}`}
                onPress={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                style={[styles.option, answers[question.id] === optionIndex && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{String(option)}</Text>
              </Pressable>
            ))}
          </View>
        );
      })}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable disabled={!ready || busy} onPress={() => void submit()} style={[styles.button, (!ready || busy) && styles.disabled]}>
        {busy ? <ActivityIndicator /> : <Text style={styles.buttonText}>Submit quiz</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 14 },
  center: { padding: 30, alignItems: 'center', gap: 12 },
  link: { color: colors.primary, fontWeight: '800' },
  eyebrow: { color: colors.accent, fontWeight: '800', letterSpacing: 1.2, fontSize: 12, marginTop: 8 },
  title: { color: colors.mainText, fontSize: 30, lineHeight: 36, fontWeight: '800' },
  muted: { color: colors.mutedText },
  body: { color: colors.mainText, fontSize: 16, lineHeight: 24 },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, gap: 10 },
  question: { color: colors.mainText, fontWeight: '800', fontSize: 16, lineHeight: 23 },
  option: { borderRadius: 12, borderWidth: 1, borderColor: '#2A3A52', padding: 13 },
  selectedOption: { borderColor: colors.primary, backgroundColor: '#102E32' },
  optionText: { color: colors.mainText },
  button: { minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  disabled: { opacity: 0.45 },
  buttonText: { color: '#06111C', fontWeight: '900', fontSize: 16 },
  error: { color: '#FCA5A5' },
});
