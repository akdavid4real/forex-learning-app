import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCourseSelection } from '../../src/course-selection-context';
import { useLearnerData } from '../../src/learner-data-context';
import { getModuleCompletion, isLessonComplete } from '../../src/roadmap-utils';
import { colors } from '../../src/theme';
import type { CourseModule, Lesson } from '../../src/services/forex-api';

export function LiveCourseRoadmap({ onBack, onOpenLesson, onOpenQuiz }: { onBack: () => void; onOpenLesson: () => void; onOpenQuiz: () => void }) {
  const { currentCourse, progress } = useLearnerData();
  const { setLesson, setQuizId } = useCourseSelection();

  const modules = currentCourse?.modules ?? [];

  function openLesson(lesson: Lesson) {
    setLesson(lesson);
    onOpenLesson();
  }

  function openQuiz(module: CourseModule) {
    const quiz = module.quizzes?.[0];
    if (!quiz) return;
    setQuizId(quiz.id);
    onOpenQuiz();
  }

  return (
    <View style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>LEARN</Text>
      <Text style={styles.title}>{currentCourse?.title ?? 'Forex Foundations'}</Text>
      <Text style={styles.subtitle}>{currentCourse?.description ?? 'Your structured learning path.'}</Text>

      {modules.length ? modules.map((module, moduleIndex) => {
        const unlocked = module.unlocked !== false || moduleIndex === 0;
        const completion = getModuleCompletion(module, progress);
        const lessons = module.lessons ?? [];
        const everyLessonComplete = lessons.length > 0 && lessons.every((lesson) => isLessonComplete(progress, lesson.id));

        return (
          <View key={module.id} style={[styles.card, !unlocked && styles.locked]}>
            <View style={styles.row}>
              <View style={styles.number}><Text style={styles.numberText}>{moduleIndex + 1}</Text></View>
              <View style={styles.grow}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleMeta}>{unlocked ? `${completion}% complete` : 'Locked'}</Text>
              </View>
            </View>

            {unlocked ? lessons.map((lesson) => {
              const done = isLessonComplete(progress, lesson.id);
              return (
                <Pressable key={lesson.id} onPress={() => openLesson(lesson)} style={styles.lessonRow}>
                  <Text style={styles.lessonStatus}>{done ? '✓' : '○'}</Text>
                  <View style={styles.grow}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.moduleMeta}>{lesson.estimated_minutes} min</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              );
            }) : null}

            {unlocked && module.quizzes?.[0] ? (
              <Pressable disabled={!everyLessonComplete} onPress={() => openQuiz(module)} style={[styles.quizButton, !everyLessonComplete && styles.quizDisabled]}>
                <Text style={styles.quizText}>{everyLessonComplete ? 'Take module quiz' : 'Complete lessons to unlock quiz'}</Text>
              </Pressable>
            ) : null}
          </View>
        );
      }) : (
        <View style={styles.card}>
          <Text style={styles.moduleTitle}>Course content is being prepared</Text>
          <Text style={styles.subtitle}>Connect the seeded Supabase project to load the full roadmap.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 14 },
  back: { color: colors.primary, fontWeight: '800', fontSize: 16 },
  eyebrow: { color: colors.accent, fontWeight: '800', letterSpacing: 1.4, fontSize: 12, marginTop: 8 },
  title: { color: colors.mainText, fontWeight: '800', fontSize: 30 },
  subtitle: { color: colors.mutedText, lineHeight: 21 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, gap: 12 },
  locked: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  number: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: '#06111C', fontWeight: '900' },
  grow: { flex: 1 },
  moduleTitle: { color: colors.mainText, fontWeight: '800', fontSize: 18 },
  moduleMeta: { color: colors.mutedText, fontSize: 13, marginTop: 2 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#2A3A52', paddingTop: 12 },
  lessonStatus: { color: colors.primary, fontSize: 19, width: 24 },
  lessonTitle: { color: colors.mainText, fontWeight: '700' },
  chevron: { color: colors.mutedText, fontSize: 24 },
  quizButton: { borderRadius: 12, minHeight: 44, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  quizDisabled: { opacity: 0.35 },
  quizText: { color: '#17120A', fontWeight: '800' },
});
