import type { FastifyPluginAsync } from 'fastify';
import type { AppServices } from '../app.ts';
import { requireUser } from '../plugins/auth.ts';

export function createBookmarkRoutes(services: AppServices): FastifyPluginAsync {
  return async function bookmarkRoutes(app) {
    app.get('/', { preHandler: requireUser(services) }, async (request) => {
      const { data, error } = await services.supabase!
        .from('bookmarks')
        .select('lesson_id, created_at, lessons(id, title, estimated_minutes, module_id, position)')
        .eq('user_id', request.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { bookmarks: data };
    });

    app.put('/:lessonId', { preHandler: requireUser(services) }, async (request, reply) => {
      const { lessonId } = request.params as { lessonId: string };
      const { error } = await services.supabase!.from('bookmarks').upsert({ lesson_id: lessonId, user_id: request.user.id });
      if (error) throw error;
      return reply.code(204).send();
    });

    app.delete('/:lessonId', { preHandler: requireUser(services) }, async (request, reply) => {
      const { lessonId } = request.params as { lessonId: string };
      const { error } = await services.supabase!.from('bookmarks').delete().eq('lesson_id', lessonId).eq('user_id', request.user.id);
      if (error) throw error;
      return reply.code(204).send();
    });
  };
}
