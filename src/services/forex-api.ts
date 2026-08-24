const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

export type Course = {
  description: string;
  id: string;
  slug: string;
  title: string;
};

export type UserProfile = {
  avatar_url: string | null;
  current_streak: number;
  display_name: string | null;
  id: string;
  longest_streak: number;
  xp: number;
};

export type QuizQuestion = {
  answers: unknown;
  explanation: string | null;
  id: string;
  position: number;
  prompt: string;
};

export type Quiz = {
  id: string;
  passing_score: number;
  quiz_questions: QuizQuestion[];
  title: string;
};

export type Lesson = {
  content: unknown;
  estimated_minutes: number;
  id: string;
  module_id: string;
  position: number;
  title: string;
};

export type QuizAttempt = {
  attempt_id: string;
  awarded_xp: number;
  passed: boolean;
  score: number;
  unlocked_module_id: string | null;
};

export type LessonProgress = {
  completed_at: string | null;
  last_viewed_at: string;
  lesson_id: string;
};

type ApiErrorBody = {
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new ApiError('EXPO_PUBLIC_API_URL is not configured.', 0);
  }

  return apiBaseUrl.replace(/\/$/, '');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
) {
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError('Unable to reach the learning API.', 0);
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(errorBody.error ?? 'The API request failed.', response.status);
  }

  return (await response.json()) as T;
}

export function getCourses() {
  return request<{ courses: Course[] }>('/courses');
}

export function getCurrentUser(accessToken: string) {
  return request<{ profile: UserProfile | null }>('/users/me', {}, accessToken);
}

export function completeLesson(accessToken: string, lessonId: string) {
  return request<{ progress: { awarded_xp: number } }>(
    `/progress/lessons/${lessonId}/complete`,
    { method: 'POST' },
    accessToken,
  );
}

export function getLessonProgress(accessToken: string) {
  return request<{ lessons: LessonProgress[] }>('/progress', {}, accessToken);
}

export function getLesson(accessToken: string, lessonId: string) {
  return request<{ lesson: Lesson }>(`/lessons/${lessonId}`, {}, accessToken);
}

export function getQuiz(accessToken: string, quizId: string) {
  return request<{ quiz: Quiz }>(`/quizzes/${quizId}`, {}, accessToken);
}

export function submitQuizAttempt(
  accessToken: string,
  quizId: string,
  answers: number[],
) {
  return request<{ attempt: QuizAttempt }>(
    `/quizzes/${quizId}/attempts`,
    {
      body: JSON.stringify({ answers }),
      method: 'POST',
    },
    accessToken,
  );
}
