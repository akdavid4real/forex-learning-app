import { useCallback } from 'react';

import { completeLesson, removeBookmark, saveBookmark, submitQuizAttempt } from './services/forex-api';
import { useLearnerData } from './learner-data-context';
import { useSession } from './session-context';

export function useLiveLearner() {
  const { session } = useSession();
  const { bookmarks, refresh } = useLearnerData();
  const token = session?.access_token;

  const complete = useCallback(async (lessonId: string) => {
    if (!token) return null;
    const result = await completeLesson(token, lessonId);
    await refresh();
    return result;
  }, [refresh, token]);

  const toggleBookmark = useCallback(async (lessonId: string) => {
    if (!token) return;
    const exists = bookmarks.some((item) => item.lesson_id === lessonId);
    if (exists) await removeBookmark(token, lessonId);
    else await saveBookmark(token, lessonId);
    await refresh();
  }, [bookmarks, refresh, token]);

  const submitQuiz = useCallback(async (quizId: string, answers: number[]) => {
    if (!token) return null;
    const result = await submitQuizAttempt(token, quizId, answers);
    await refresh();
    return result;
  }, [refresh, token]);

  return {
    canPersist: Boolean(token),
    completeLesson: complete,
    isBookmarked: (lessonId: string) => bookmarks.some((item) => item.lesson_id === lessonId),
    submitQuiz,
    toggleBookmark,
  };
}
