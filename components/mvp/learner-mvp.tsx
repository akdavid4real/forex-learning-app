import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLearnerData } from '../../src/learner-data-context';
import { useSession } from '../../src/session-context';
import {
  completeLesson, getLesson, getQuiz, isApiConfigured, removeBookmark, saveBookmark, submitQuizAttempt,
  type CourseModule, type Lesson, type Quiz,
} from '../../src/services/forex-api';
import { colors } from '../../src/theme';

type Screen = 'home' | 'roadmap' | 'lesson' | 'quiz' | 'progress' | 'profile';
const demoLessonContent: Record<string, string[]> = {
  'demo-lesson-1': ['A currency pair compares the value of one currency with another.', 'The first currency is the base currency; the second is the quote currency.', 'EUR/USD at 1.1000 means one euro is worth 1.10 US dollars.'],
  'demo-lesson-2': ['A pip is a standard unit of price movement.', 'Position size determines how much each pip is worth.', 'The spread is the difference between bid and ask and is part of your trading cost.'],
  'demo-lesson-3': ['Decide your maximum risk before entering a trade.', 'Use stop losses and position sizing together.', 'Protecting capital is more important than maximizing any single trade.'],
};
const demoQuiz: Quiz = { id: 'demo-quiz-1', title: 'Market Foundations Check', passing_score: 70, quiz_questions: [
  { id: 'dq1', position: 1, prompt: 'In EUR/USD, which currency is the base currency?', answers: ['EUR', 'USD', 'Both'], explanation: 'The first currency in a pair is the base currency.' },
  { id: 'dq2', position: 2, prompt: 'What does spread represent?', answers: ['Broker trading cost between bid and ask', 'Your account balance', 'A guaranteed profit'], explanation: 'Spread is the distance between bid and ask.' },
] };

function answerOptions(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>).map(String);
  return [];
}
function lessonParagraphs(content: unknown): string[] {
  if (typeof content === 'string') return [content];
  if (Array.isArray(content)) return content.map((item) => typeof item === 'string' ? item : JSON.stringify(item));
  if (content && typeof content === 'object') {
    const object = content as Record<string, unknown>;
    const body = object.body ?? object.paragraphs ?? object.sections;
    if (Array.isArray(body)) return body.map((item) => typeof item === 'string' ? item : (typeof item === 'object' && item && 'text' in item ? String((item as { text: unknown }).text) : JSON.stringify(item)));
    if (typeof body === 'string') return [body];
  }
  return ['Lesson content is being prepared.'];
}

export function LearnerMvp() {
  const { session, signOut } = useSession();
  const { achievements, bookmarks, courses, currentCourse, error, loading, profile, progress, refresh, selectCourse } = useLearnerData();
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const completedLessonIds = useMemo(() => new Set(progress.lessons.filter((item) => item.completed_at).map((item) => item.lesson_id)), [progress.lessons]);
  const unlockedModuleIds = useMemo(() => new Set(progress.modules.map((item) => item.module_id)), [progress.modules]);
  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((item) => item.lesson_id)), [bookmarks]);
  const isModuleUnlocked = (module: CourseModule) => module.position === 1 || unlockedModuleIds.has(module.id);

  async function openLesson(module: CourseModule, lessonId: string) {
    if (!isModuleUnlocked(module)) return;
    setBusy(true); setResult(null); setSelectedModule(module);
    try {
      if (!isApiConfigured() || !session?.access_token) {
        const summary = module.lessons.find((item) => item.id === lessonId)!;
        setLesson({ ...summary, content: demoLessonContent[lessonId] ?? ['Demo lesson content.'] });
      } else setLesson((await getLesson(session.access_token, lessonId)).lesson);
      setScreen('lesson');
    } catch (caught) { setResult(caught instanceof Error ? caught.message : 'Unable to open lesson.'); }
    finally { setBusy(false); }
  }

  async function finishLesson() {
    if (!lesson) return;
    setBusy(true); setResult(null);
    try {
      if (session?.access_token && isApiConfigured()) {
        const response = await completeLesson(session.access_token, lesson.id);
        setResult(response.progress.awarded_xp ? `Lesson complete · +${response.progress.awarded_xp} XP` : 'Lesson complete');
        await refresh();
      } else setResult('Lesson complete in demo mode.');
    } catch (caught) { setResult(caught instanceof Error ? caught.message : 'Unable to complete lesson.'); }
    finally { setBusy(false); }
  }

  async function openQuiz(module: CourseModule) {
    const summary = module.quizzes[0];
    if (!summary || !isModuleUnlocked(module)) return;
    const allLessonsDone = module.lessons.every((item) => completedLessonIds.has(item.id));
    if (isApiConfigured() && session?.access_token && !allLessonsDone) { setResult('Complete every lesson in this module before taking the quiz.'); return; }
    setBusy(true); setSelectedModule(module); setResult(null);
    try {
      setQuiz(!isApiConfigured() || !session?.access_token ? { ...demoQuiz, id: summary.id, title: summary.title, passing_score: summary.passing_score } : (await getQuiz(session.access_token, summary.id)).quiz);
      setAnswers([]); setScreen('quiz');
    } catch (caught) { setResult(caught instanceof Error ? caught.message : 'Unable to open quiz.'); }
    finally { setBusy(false); }
  }

  async function submitQuiz() {
    if (!quiz) return;
    if (answers.length !== quiz.quiz_questions.length || answers.some((value) => value === undefined)) { setResult('Answer every question before submitting.'); return; }
    setBusy(true);
    try {
      if (!isApiConfigured() || !session?.access_token) setResult('Demo quiz complete. Connect Supabase to persist scores and unlock modules.');
      else {
        const response = await submitQuizAttempt(session.access_token, quiz.id, answers);
        setResult(`${response.attempt.passed ? 'Passed' : 'Keep learning'} · ${response.attempt.score}%${response.attempt.awarded_xp ? ` · +${response.attempt.awarded_xp} XP` : ''}`);
        await refresh();
      }
    } catch (caught) { setResult(caught instanceof Error ? caught.message : 'Unable to submit quiz.'); }
    finally { setBusy(false); }
  }

  async function toggleBookmark() {
    if (!lesson || !session?.access_token || !isApiConfigured()) return;
    setBusy(true);
    try { bookmarkedIds.has(lesson.id) ? await removeBookmark(session.access_token, lesson.id) : await saveBookmark(session.access_token, lesson.id); await refresh(); }
    finally { setBusy(false); }
  }

  if (loading) return <Center label="Loading your learning path…" />;

  return (
    <SafeAreaView style={styles.page}>
      {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => void refresh()}><Text style={styles.link}>Retry</Text></Pressable></View> : null}
      <ScrollView contentContainerStyle={styles.content}>
        {screen === 'home' ? <>
          <Text style={styles.eyebrow}>FOREX LEARNING</Text><Text style={styles.hero}>Learn to trade with structure, not hype.</Text>
          <Text style={styles.sub}>Master the market one short lesson at a time. Risk comes before reward.</Text>
          <View style={styles.stats}><Stat label="XP" value={String(profile?.xp ?? 0)} /><Stat label="Streak" value={`${profile?.current_streak ?? 0}d`} /><Stat label="Done" value={String(completedLessonIds.size)} /></View>
          <Text style={styles.sectionTitle}>Your courses</Text>
          {courses.map((course) => <Pressable key={course.id} style={styles.courseCard} onPress={() => void selectCourse(course.id).then(() => setScreen('roadmap'))}><Text style={styles.cardTitle}>{course.title}</Text><Text style={styles.body}>{course.description}</Text><Text style={styles.link}>Continue learning →</Text></Pressable>)}
        </> : null}

        {screen === 'roadmap' && currentCourse ? <>
          <Back onPress={() => setScreen('home')} /><Text style={styles.eyebrow}>COURSE ROADMAP</Text><Text style={styles.title}>{currentCourse.title}</Text><Text style={styles.body}>{currentCourse.description}</Text>
          {result ? <Notice text={result} /> : null}
          {currentCourse.modules.map((module) => {
            const unlocked = isModuleUnlocked(module); const completed = progress.modules.some((item) => item.module_id === module.id && item.completed_at);
            return <View key={module.id} style={[styles.moduleCard, !unlocked && styles.locked]}><View style={styles.row}><Text style={styles.moduleNumber}>{module.position}</Text><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{module.title}</Text><Text style={styles.body}>{module.description}</Text></View><Text style={styles.badge}>{completed ? 'DONE' : unlocked ? 'OPEN' : 'LOCKED'}</Text></View>
              {unlocked ? module.lessons.map((item) => <Pressable key={item.id} style={styles.lessonRow} onPress={() => void openLesson(module, item.id)}><Text style={styles.lessonCheck}>{completedLessonIds.has(item.id) ? '✓' : '○'}</Text><View style={{ flex: 1 }}><Text style={styles.lessonTitle}>{item.title}</Text><Text style={styles.meta}>{item.estimated_minutes} min</Text></View><Text style={styles.link}>Open</Text></Pressable>) : null}
              {unlocked && module.quizzes[0] ? <Pressable style={styles.quizButton} onPress={() => void openQuiz(module)}><Text style={styles.quizText}>Take module quiz · {module.quizzes[0].passing_score}% to pass</Text></Pressable> : null}
            </View>;
          })}
        </> : null}

        {screen === 'lesson' && lesson ? <>
          <Back onPress={() => setScreen('roadmap')} /><Text style={styles.eyebrow}>LESSON · {lesson.estimated_minutes} MIN</Text><Text style={styles.title}>{lesson.title}</Text>
          {lessonParagraphs(lesson.content).map((paragraph, index) => <Text key={index} style={styles.lessonBody}>{paragraph}</Text>)}
          {result ? <Notice text={result} /> : null}
          <Pressable disabled={busy} style={styles.primary} onPress={() => void finishLesson()}><Text style={styles.primaryText}>{completedLessonIds.has(lesson.id) ? 'Review completed lesson' : 'Mark lesson complete'}</Text></Pressable>
          {session?.access_token && isApiConfigured() ? <Pressable disabled={busy} style={styles.secondary} onPress={() => void toggleBookmark()}><Text style={styles.secondaryText}>{bookmarkedIds.has(lesson.id) ? 'Remove bookmark' : 'Bookmark lesson'}</Text></Pressable> : null}
          {selectedModule?.quizzes[0] ? <Pressable style={styles.secondary} onPress={() => void openQuiz(selectedModule)}><Text style={styles.secondaryText}>Go to module quiz</Text></Pressable> : null}
        </> : null}

        {screen === 'quiz' && quiz ? <>
          <Back onPress={() => setScreen('roadmap')} /><Text style={styles.eyebrow}>MODULE CHECK</Text><Text style={styles.title}>{quiz.title}</Text><Text style={styles.body}>Pass mark: {quiz.passing_score}%</Text>
          {quiz.quiz_questions.map((question, questionIndex) => <View key={question.id} style={styles.questionCard}><Text style={styles.question}>{questionIndex + 1}. {question.prompt}</Text>{answerOptions(question.answers).map((option, optionIndex) => <Pressable key={optionIndex} onPress={() => setAnswers((previous) => { const next = [...previous]; next[questionIndex] = optionIndex; return next; })} style={[styles.answer, answers[questionIndex] === optionIndex && styles.answerSelected]}><Text style={styles.answerText}>{option}</Text></Pressable>)}</View>)}
          {result ? <Notice text={result} /> : null}<Pressable disabled={busy} style={styles.primary} onPress={() => void submitQuiz()}><Text style={styles.primaryText}>Submit answers</Text></Pressable>
        </> : null}

        {screen === 'progress' ? <><Text style={styles.eyebrow}>PROGRESS</Text><Text style={styles.title}>Your momentum</Text><View style={styles.stats}><Stat label="XP" value={String(profile?.xp ?? 0)} /><Stat label="Streak" value={`${profile?.current_streak ?? 0}d`} /><Stat label="Best" value={`${profile?.longest_streak ?? 0}d`} /></View><Text style={styles.sectionTitle}>Completed lessons</Text>{progress.lessons.filter((item) => item.completed_at).map((item) => <View key={item.lesson_id} style={styles.simpleRow}><Text style={styles.lessonCheck}>✓</Text><Text style={styles.lessonTitle}>{item.lessons?.title ?? 'Completed lesson'}</Text></View>)}<Text style={styles.sectionTitle}>Achievements</Text>{achievements.length ? achievements.map((item) => <View key={item.id} style={styles.courseCard}><Text style={styles.cardTitle}>{item.title ?? 'Achievement'}</Text><Text style={styles.body}>{item.description}</Text></View>) : <Text style={styles.body}>Complete your first lesson and quiz to start earning achievements.</Text>}</> : null}

        {screen === 'profile' ? <><Text style={styles.eyebrow}>PROFILE</Text><Text style={styles.title}>{profile?.display_name || session?.user?.email || 'Learner'}</Text><Text style={styles.body}>{session?.user?.email ?? 'Demo mode'}</Text><Text style={styles.sectionTitle}>Saved lessons</Text>{bookmarks.length ? bookmarks.map((item) => <View key={item.lesson_id} style={styles.simpleRow}><Text style={styles.lessonCheck}>★</Text><Text style={styles.lessonTitle}>{item.lessons?.title ?? 'Saved lesson'}</Text></View>) : <Text style={styles.body}>You have no saved lessons yet.</Text>}{session ? <Pressable style={styles.danger} onPress={() => void signOut()}><Text style={styles.primaryText}>Sign out</Text></Pressable> : null}</> : null}
        {busy ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
      </ScrollView>
      {screen !== 'lesson' && screen !== 'quiz' ? <View style={styles.tabs}>{(['home', 'roadmap', 'progress', 'profile'] as Screen[]).map((item) => <Pressable key={item} style={styles.tab} onPress={() => setScreen(item)}><Text style={[styles.tabText, screen === item && styles.tabActive]}>{item === 'roadmap' ? 'Learn' : item[0].toUpperCase() + item.slice(1)}</Text></Pressable>)}</View> : null}
    </SafeAreaView>
  );
}

function Center({ label }: { label: string }) { return <SafeAreaView style={styles.center}><ActivityIndicator /><Text style={styles.body}>{label}</Text></SafeAreaView>; }
function Back({ onPress }: { onPress: () => void }) { return <Pressable onPress={onPress}><Text style={styles.link}>← Back</Text></Pressable>; }
function Notice({ text }: { text: string }) { return <View style={styles.notice}><Text style={styles.noticeText}>{text}</Text></View>; }
function Stat({ label, value }: { label: string; value: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.meta}>{label}</Text></View>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background }, center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 12 }, content: { padding: 20, paddingBottom: 110, gap: 14 },
  eyebrow: { color: colors.primary, fontWeight: '900', letterSpacing: 1.3, fontSize: 12, marginTop: 4 }, hero: { color: colors.mainText, fontSize: 34, lineHeight: 40, fontWeight: '900' }, title: { color: colors.mainText, fontSize: 28, lineHeight: 34, fontWeight: '900' }, sub: { color: colors.mutedText, fontSize: 17, lineHeight: 25 }, body: { color: colors.mutedText, lineHeight: 21 }, lessonBody: { color: colors.mainText, fontSize: 17, lineHeight: 27 }, sectionTitle: { color: colors.mainText, fontWeight: '900', fontSize: 20, marginTop: 10 }, cardTitle: { color: colors.mainText, fontWeight: '900', fontSize: 18 },
  stats: { flexDirection: 'row', gap: 10 }, stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16 }, statValue: { color: colors.mainText, fontSize: 24, fontWeight: '900' }, meta: { color: colors.mutedText, fontSize: 12, marginTop: 3 },
  courseCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, gap: 8 }, moduleCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, gap: 12 }, locked: { opacity: 0.55 }, row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, moduleNumber: { width: 34, height: 34, borderRadius: 17, textAlign: 'center', textAlignVertical: 'center', backgroundColor: colors.primary, color: '#06211F', fontWeight: '900' }, badge: { color: colors.accent, fontWeight: '900', fontSize: 11 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.background, borderRadius: 14, padding: 12 }, lessonCheck: { color: colors.primary, fontSize: 18, fontWeight: '900' }, lessonTitle: { color: colors.mainText, fontWeight: '700', flexShrink: 1 }, quizButton: { borderWidth: 1, borderColor: colors.accent, borderRadius: 14, padding: 13 }, quizText: { color: colors.accent, fontWeight: '800' },
  primary: { backgroundColor: colors.primary, padding: 15, borderRadius: 14, alignItems: 'center', marginTop: 6 }, primaryText: { color: '#06211F', fontWeight: '900', fontSize: 15 }, secondary: { borderWidth: 1, borderColor: '#334155', padding: 14, borderRadius: 14, alignItems: 'center' }, secondaryText: { color: colors.mainText, fontWeight: '800' }, danger: { backgroundColor: '#F05252', padding: 15, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  questionCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, gap: 10 }, question: { color: colors.mainText, fontSize: 17, fontWeight: '800', lineHeight: 23 }, answer: { borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 13 }, answerSelected: { borderColor: colors.primary, backgroundColor: '#113A39' }, answerText: { color: colors.mainText },
  simpleRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 10 }, notice: { backgroundColor: '#162C35', borderRadius: 12, padding: 12 }, noticeText: { color: colors.mainText, lineHeight: 20 }, error: { backgroundColor: '#3A1D25', padding: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, errorText: { color: '#FCA5A5', flex: 1 }, link: { color: colors.primary, fontWeight: '900' },
  tabs: { position: 'absolute', left: 12, right: 12, bottom: 10, backgroundColor: colors.surface, borderRadius: 20, flexDirection: 'row', padding: 8 }, tab: { flex: 1, alignItems: 'center', paddingVertical: 10 }, tabText: { color: colors.mutedText, fontWeight: '700', fontSize: 12 }, tabActive: { color: colors.primary },
});
