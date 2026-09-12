import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { FastifyInstance } from 'fastify';
import { createApp, type AppServices } from '../src/app.ts';

const environment = { ALLOWED_ORIGINS: 'http://localhost:8081', HOST: '127.0.0.1', PORT: 3000 };

type TableData = Record<string, unknown[]>;

function queryFor(rows: unknown[]) {
  const query: Record<string, unknown> = {};
  const chain = () => query;
  query.select = chain;
  query.eq = chain;
  query.in = chain;
  query.order = async () => ({ data: rows, error: null });
  query.maybeSingle = async () => ({ data: rows[0] ?? null, error: null });
  query.then = (resolve: (value: unknown) => unknown) => Promise.resolve(resolve({ data: rows, error: null }));
  return query;
}

function servicesWithTables(tables: TableData): AppServices {
  return {
    supabase: {
      auth: {
        getUser: async () => ({ data: { user: { app_metadata: {}, email: 'learner@example.com', id: 'user-1' } }, error: null }),
      },
      from: (table: string) => queryFor(tables[table] ?? []),
    } as unknown as NonNullable<AppServices['supabase']>,
  };
}

describe('learner data contract', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp({
      environment,
      services: servicesWithTables({
        courses: [{ id: 'course-1', slug: 'forex-foundations', title: 'Forex Foundations', description: 'Core course' }],
        modules: [{ id: 'module-1', course_id: 'course-1', title: 'Market Foundations', position: 1, description: 'Basics' }],
        lessons: [{ id: 'lesson-1', module_id: 'module-1', title: 'Currency pairs', position: 1, estimated_minutes: 6 }],
        quizzes: [{ id: 'quiz-1', module_id: 'module-1', title: 'Module check', passing_score: 70, xp_reward: 20 }],
        user_lesson_progress: [{ lesson_id: 'lesson-1', completed_at: '2026-09-12T10:00:00Z', last_viewed_at: '2026-09-12T10:00:00Z', lessons: { id: 'lesson-1', title: 'Currency pairs', module_id: 'module-1' } }],
        user_module_progress: [{ module_id: 'module-1', unlocked_at: '2026-09-12T09:00:00Z', completed_at: null }],
        user_quiz_attempts: [{ quiz_id: 'quiz-1', score: 80, passed: true, created_at: '2026-09-12T10:30:00Z' }],
      }),
    });
  });

  afterAll(async () => { await app.close(); });

  test('course roadmap includes lessons and quiz metadata', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/courses/course-1' });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.course.modules[0].lessons[0].id).toBe('lesson-1');
    expect(body.course.modules[0].quizzes[0]).toMatchObject({ id: 'quiz-1', passing_score: 70 });
  });

  test('progress response exposes lesson, module and quiz state', async () => {
    const response = await app.inject({ headers: { authorization: 'Bearer test-token' }, method: 'GET', url: '/api/v1/progress' });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.lessons[0].lesson_id).toBe('lesson-1');
    expect(body.modules[0].module_id).toBe('module-1');
    expect(body.quizzes[0]).toMatchObject({ quiz_id: 'quiz-1', passed: true, score: 80 });
  });
});
