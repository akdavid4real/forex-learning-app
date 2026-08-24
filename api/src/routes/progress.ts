import type { FastifyPluginAsync } from 'fastify';

import type { AppServices } from '../app.ts';
import { requireUser } from '../plugins/auth.ts';

type LessonParams = {
  lessonId: string;
};

export function createProgressRoutes(services: AppServices): FastifyPluginAsync {
  return async function progressRoutes(app) {
    app.get('/', { preHandler: requireUser(services) }, async (request) => {
      const { data, error } = await services.supabase!
        .from('user_lesson_progress')
        .select(
          `lesson_id, completed_at, last_viewed_at,
          lessons(id, title, module_id)`,
        )
        .eq('user_id', request.user.id)
        .order('last_viewed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { lessons: data };
    });

    app.post(
      '/lessons/:lessonId/complete',
      { preHandler: requireUser(services) },
      async (request) => {
        const { lessonId } = request.params as LessonParams;
        const { data, error } = await services.supabase!.rpc(
          'record_lesson_completion',
          {
            target_lesson_id: lessonId,
            target_user_id: request.user.id,
          },
        );

        if (error) {
          throw error;
        }

        return { progress: data?.[0] };
      },
    );
  };
}
