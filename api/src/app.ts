import cors from '@fastify/cors';
import Fastify from 'fastify';

import { readEnvironment, type Environment } from './config/env.ts';
import { createSupabaseClient } from './plugins/supabase.ts';
import { createAdminRoutes } from './routes/admin.ts';
import { createAdminModuleRoutes } from './routes/admin-modules.ts';
import { createAdminQuizRoutes } from './routes/admin-quizzes.ts';
import { createBookmarkRoutes } from './routes/bookmarks.ts';
import { createCourseRoutes } from './routes/courses.ts';
import { healthRoutes } from './routes/health.ts';
import { createLessonRoutes } from './routes/lessons.ts';
import { createProgressRoutes } from './routes/progress.ts';
import { createQuizRoutes } from './routes/quizzes.ts';
import { createUserRoutes } from './routes/users.ts';

export type AppServices = {
  supabase: ReturnType<typeof createSupabaseClient>;
};

type CreateAppOptions = {
  environment?: Environment;
  services?: AppServices;
};

export async function createApp(options: CreateAppOptions = {}) {
  const environment = options.environment ?? readEnvironment(process.env);
  const app = Fastify({ logger: true });
  const services = options.services ?? {
    supabase: createSupabaseClient(environment),
  };
  const allowedOrigins = environment.ALLOWED_ORIGINS.split(',').map((origin) =>
    origin.trim(),
  );

  await app.register(cors, {
    origin: allowedOrigins,
  });

  await app.register(healthRoutes, {
    prefix: '/api/v1',
  });

  await app.register(createUserRoutes(services), {
    prefix: '/api/v1/users',
  });

  await app.register(createCourseRoutes(services), {
    prefix: '/api/v1/courses',
  });

  await app.register(createLessonRoutes(services), {
    prefix: '/api/v1/lessons',
  });

  await app.register(createBookmarkRoutes(services), {
    prefix: '/api/v1/bookmarks',
  });

  await app.register(createProgressRoutes(services), {
    prefix: '/api/v1/progress',
  });

  await app.register(createQuizRoutes(services), {
    prefix: '/api/v1/quizzes',
  });

  await app.register(createAdminRoutes(services), {
    prefix: '/api/v1/admin',
  });

  await app.register(createAdminModuleRoutes(services), {
    prefix: '/api/v1/admin',
  });

  await app.register(createAdminQuizRoutes(services), {
    prefix: '/api/v1/admin',
  });

  app.setErrorHandler((error, _request, reply) => {
    const databaseError = error as { code?: string };
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected server error occurred.';

    if (databaseError.code === 'P0002') {
      return reply.code(404).send({ error: message });
    }

    if (databaseError.code === 'P0001') {
      return reply.code(403).send({ error: message });
    }

    if (databaseError.code === '23505') {
      return reply.code(409).send({ error: 'That record already exists.' });
    }

    if (databaseError.code === '23503' || databaseError.code === '23514') {
      return reply.code(400).send({ error: 'The submitted data is invalid.' });
    }

    app.log.error(error);
    return reply.code(500).send({
      error: 'An unexpected server error occurred.',
    });
  });

  return app;
}
