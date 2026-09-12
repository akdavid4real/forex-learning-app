import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Lesson } from './services/forex-api';

type Selection = {
  lesson: Lesson | null;
  quizId: string | null;
  setLesson: (lesson: Lesson | null) => void;
  setQuizId: (quizId: string | null) => void;
};

const SelectionContext = createContext<Selection | null>(null);

export function CourseSelectionProvider({ children }: PropsWithChildren) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const value = useMemo(() => ({ lesson, quizId, setLesson, setQuizId }), [lesson, quizId]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useCourseSelection() {
  const value = useContext(SelectionContext);
  if (!value) throw new Error('useCourseSelection must be used inside CourseSelectionProvider');
  return value;
}
