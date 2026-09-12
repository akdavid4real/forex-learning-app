const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

export type Course = { id: string; slug: string; title: string; description: string };
export type LessonSummary = { id: string; module_id: string; title: string; position: number; estimated_minutes: number };
export type QuizSummary = { id: string; module_id: string; title: string; passing_score: number; xp_reward: number };
export type CourseModule = {
  id: string;
  course_id?: string;
  position: number;
  title: string;
  description?: string | null;
  lessons: LessonSummary[];
  quizzes: QuizSummary[];
};
export type CourseRoadmap = Course & { modules: CourseModule[] };
export type UserProfile = { avatar_url: string | null; current_streak: number; display_name: string | null; id: string; longest_streak: number; xp: number };
export type Achievement = { id: string; slug?: string; title?: string; description?: string | null; earned_at?: string };
export type QuizQuestion = { answers: unknown; explanation: string | null; id: string; position: number; prompt: string };
export type Quiz = { id: string; passing_score: number; quiz_questions: QuizQuestion[]; title: string };
export type Lesson = { content: unknown; estimated_minutes: number; id: string; module_id: string; position: number; title: string };
export type QuizAttempt = { attempt_id: string; awarded_xp: number; passed: boolean; score: number; unlocked_module_id: string | null };
export type LessonProgress = { completed_at: string | null; last_viewed_at: string; lesson_id: string; lessons?: { id: string; title: string; module_id: string } | null };
export type ModuleProgress = { module_id: string; unlocked_at: string; completed_at: string | null };
export type QuizProgress = { quiz_id: string; score: number; passed: boolean; created_at: string };
export type LearningProgress = { lessons: LessonProgress[]; modules: ModuleProgress[]; quizzes: QuizProgress[] };
export type Bookmark = { lesson_id: string; created_at?: string; lessons?: Lesson | null };

type ApiErrorBody = { error?: string };
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status; }
}
export function isApiConfigured() { return Boolean(apiBaseUrl); }
function getApiBaseUrl() { if (!apiBaseUrl) throw new ApiError('EXPO_PUBLIC_API_URL is not configured.', 0); return apiBaseUrl.replace(/\/$/, ''); }
async function request<T>(path: string, options: RequestInit = {}, accessToken?: string) {
  const headers = new Headers(options.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (options.body) headers.set('Content-Type', 'application/json');
  let response: Response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { ...options, headers }); }
  catch { throw new ApiError('Unable to reach the learning API.', 0); }
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(errorBody.error ?? 'The API request failed.', response.status);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
export const getCourses = () => request<{ courses: Course[] }>('/courses');
export const getCourse = (courseId: string, accessToken?: string) => request<{ course: CourseRoadmap }>(`/courses/${courseId}`, {}, accessToken);
export const getCurrentUser = (accessToken: string) => request<{ profile: UserProfile | null }>('/users/me', {}, accessToken);
export const getAchievements = (accessToken: string) => request<{ achievements: Achievement[] }>('/users/me/achievements', {}, accessToken);
export const completeLesson = (accessToken: string, lessonId: string) => request<{ progress: { awarded_xp: number; current_streak?: number } }>(`/progress/lessons/${lessonId}/complete`, { method: 'POST' }, accessToken);
export const getLearningProgress = (accessToken: string) => request<LearningProgress>('/progress', {}, accessToken);
export const getLesson = (accessToken: string, lessonId: string) => request<{ lesson: Lesson }>(`/lessons/${lessonId}`, {}, accessToken);
export const getQuiz = (accessToken: string, quizId: string) => request<{ quiz: Quiz }>(`/quizzes/${quizId}`, {}, accessToken);
export const submitQuizAttempt = (accessToken: string, quizId: string, answers: number[]) => request<{ attempt: QuizAttempt }>(`/quizzes/${quizId}/attempts`, { body: JSON.stringify({ answers }), method: 'POST' }, accessToken);
export const getBookmarks = (accessToken: string) => request<{ bookmarks: Bookmark[] }>('/bookmarks', {}, accessToken);
export const saveBookmark = (accessToken: string, lessonId: string) => request(`/bookmarks/${lessonId}`, { method: 'PUT' }, accessToken);
export const removeBookmark = (accessToken: string, lessonId: string) => request(`/bookmarks/${lessonId}`, { method: 'DELETE' }, accessToken);
