import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { demoCourse, demoProfile, demoProgress } from './demo-data';
import {
  getAchievements, getBookmarks, getCourse, getCourses, getCurrentUser, getLearningProgress, isApiConfigured,
  type Achievement, type Bookmark, type Course, type CourseRoadmap, type LearningProgress, type UserProfile,
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
  progress: LearningProgress;
  refresh: () => Promise<void>;
  selectCourse: (courseId: string) => Promise<void>;
};

const emptyProgress: LearningProgress = { lessons: [], modules: [], quizzes: [] };
const LearnerDataContext = createContext<LearnerData | null>(null);

export function LearnerDataProvider({ children }: PropsWithChildren) {
  const { session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<CourseRoadmap | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectCourse = useCallback(async (courseId: string) => {
    if (!isApiConfigured()) { setCurrentCourse(demoCourse); return; }
    const data = await getCourse(courseId, session?.access_token);
    setCurrentCourse(data.course);
  }, [session?.access_token]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isApiConfigured()) {
      setCourses([demoCourse]);
      setCurrentCourse(demoCourse);
      setProfile(demoProfile);
      setProgress(demoProgress);
      setBookmarks([]);
      setAchievements([]);
      setLoading(false);
      return;
    }

    try {
      const courseResult = await getCourses();
      setCourses(courseResult.courses);
      const keepId = currentCourse?.id && courseResult.courses.some((course) => course.id === currentCourse.id)
        ? currentCourse.id
        : courseResult.courses[0]?.id;
      if (keepId) await selectCourse(keepId); else setCurrentCourse(null);

      if (!session?.access_token) {
        setProfile(null);
        setProgress(emptyProgress);
        setBookmarks([]);
        setAchievements([]);
        return;
      }

      const profileResult = await getCurrentUser(session.access_token);
      setProfile(profileResult.profile);

      if (!profileResult.profile || profileResult.profile.access_status !== 'active') {
        setProgress(emptyProgress);
        setBookmarks([]);
        setAchievements([]);
        return;
      }

      const [progressResult, bookmarkResult, achievementResult] = await Promise.all([
        getLearningProgress(session.access_token),
        getBookmarks(session.access_token),
        getAchievements(session.access_token),
      ]);
      setProgress(progressResult);
      setBookmarks(bookmarkResult.bookmarks);
      setAchievements(achievementResult.achievements);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load learner data.');
    } finally {
      setLoading(false);
    }
  }, [currentCourse?.id, selectCourse, session?.access_token]);

  useEffect(() => { void refresh(); }, [session?.access_token]);

  const value = useMemo(() => ({ achievements, bookmarks, courses, currentCourse, error, loading, profile, progress, refresh, selectCourse }),
    [achievements, bookmarks, courses, currentCourse, error, loading, profile, progress, refresh, selectCourse]);
  return <LearnerDataContext.Provider value={value}>{children}</LearnerDataContext.Provider>;
}

export function useLearnerData() {
  const value = useContext(LearnerDataContext);
  if (!value) throw new Error('useLearnerData must be used inside LearnerDataProvider');
  return value;
}
