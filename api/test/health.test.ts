import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { FastifyInstance } from 'fastify';

import { createApp, type AppServices } from '../src/app.ts';

const testEnvironment = {
  ALLOWED_ORIGINS: 'http://localhost:8081',
  HOST: '127.0.0.1',
  PORT: 3000,
};

function createAuthenticatedServices(role?: 'admin'): AppServices {
  return {
    supabase: {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              app_metadata: role ? { role } : {},
              id: '11111111-1111-1111-1111-111111111111',
            },
          },
          error: null,
        }),
      },
    } as NonNullable<AppServices['supabase']>['auth'],
  } as AppServices;
}

describe('health endpoint', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp({
      environment: testEnvironment,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test('returns an operational status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: 'ok' });
  });

  test('does not expose user data without Supabase configuration', async () => {
    const response = await app.inject({
      headers: {
        authorization: 'Bearer test-token',
      },
      method: 'GET',
      url: '/api/v1/users/me',
    });

    expect(response.statusCode).toBe(503);
  });

  test('reports unavailable database-backed course routes without configuration', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/courses',
    });

    expect(response.statusCode).toBe(503);
  });
});

describe('protected route guards', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp({
      environment: testEnvironment,
      services: createAuthenticatedServices(),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test('requires a bearer token for protected routes', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/bookmarks',
    });

    expect(response.statusCode).toBe(401);
  });

  test('rejects a signed-in user without an administrator role', async () => {
    const response = await app.inject({
      headers: {
        authorization: 'Bearer learner-token',
      },
      method: 'GET',
      url: '/api/v1/admin/courses',
    });

    expect(response.statusCode).toBe(403);
  });
});

describe('admin validation', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp({
      environment: testEnvironment,
      services: createAuthenticatedServices('admin'),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test('rejects an incomplete course payload', async () => {
    const response = await app.inject({
      headers: {
        authorization: 'Bearer admin-token',
      },
      method: 'POST',
      payload: {
        title: 'Forex Foundations',
      },
      url: '/api/v1/admin/courses',
    });

    expect(response.statusCode).toBe(400);
  });

  test('rejects a quiz answer key outside its answer list', async () => {
    const response = await app.inject({
      headers: {
        authorization: 'Bearer admin-token',
      },
      method: 'POST',
      payload: {
        answers: ['EUR/USD', 'GBP/USD'],
        correct_answer_index: 2,
        position: 1,
        prompt: 'Which pair is quoted first?',
        quiz_id: '11111111-1111-1111-1111-111111111111',
      },
      url: '/api/v1/admin/quiz-questions',
    });

    expect(response.statusCode).toBe(400);
  });
});
