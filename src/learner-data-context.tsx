import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { demoCourse, demoProfile } from './demo-data';
import {
  getAchievements,
  getBookmarks,
  getCourse,
  getCourses,
  getCurrentUser,
  getLessonProgress,
  isApiConfigured,
  type Achievement,
  type Bookmark,
  type Course,
  type CourseRoadmap,
  type LessonProgress,
  type UserProfile,
} from './services/forex-api';
import { useSession } from './session-context';

type LearnerData = {
  achievements: Achievement[];
  bookmarks: Bookmark[];
  courses: Course[];
  currentCourse: CourseRoadmap | null;
  error: string | null;
  loading: boolean;
  profile: UserProfile | null;
  progress: LessonProgress[];
  refresh: () => Promise<void>;
  selectCourse: (courseId: string) => Promise<void>;
};

const LearnerDataContext = createContext<LearnerData | null>(null);

export function LearnerDataProvider({ children }: PropsWithChildren) {
  const { session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<CourseRoadmap | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectCourse = useCallback(async (courseId: string) => {
    if (!isApiConfigured()) {
      setCurrentCourse(demoCourse);
      return;
    }
    const data = await getCourse(courseId, session?.access_token);
    setCurrentCourse(data.course);
  }, [session?.access_token]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isApiConfigured()) {
      setCourses([demoCourse]);
      setCurrentCourse(demoCourse);
      setProfile(session ? demoProfile : null);
      setProgress([]);
      setBookmarks([]);
      setAchievements([]);
      setLoading(false);
      return;
    }

    try {
      const courseResult = await getCourses();
      setCourses(courseResult.courses);
      if (courseResult.courses[0]) await selectCourse(courseResult.courses[0].id);

      if (session?.access_token) {
        const [profileResult, progressResult, bookmarkResult, achievementResult] = await Promise.all([
          getCurrentUser(session.access_token),
          getLessonProgress(session.access_token),
          getBookmarks(session.access_token),
          getAchievements(session.access_token),
        ]);
        setProfile(profileResult.profile);
        setProgress(progressResult.lessons);
        setBookmarks(bookmarkResult.bookmarks);
        setAchievements(achievementResult.achievements);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load learner data.');
    } finally {
      setLoading(false);
    }
  }, [selectCourse, session]);

  useEffect(() => { void refresh(); }, [refresh]);

  const value = useMemo(() => ({
    achievements,
    bookmarks,
    courses,
    currentCourse,
    error,
    loading,
    profile,
    progress,
    refresh,
    selectCourse,
  }), [achievements, bookmarks, courses, currentCourse, error, loading, profile, progress, refresh, selectCourse]);

  return <LearnerDataContext.Provider value={value}>{children}</LearnerDataContext.Provider>;
}

export function useLearnerData() {
  const value = useContext(LearnerDataContext);
  if (!value) throw new Error('useLearnerData must be used inside LearnerDataProvider');
  return value;
}
