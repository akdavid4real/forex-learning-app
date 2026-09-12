import type { FastifyPluginAsync } from 'fastify';

import type { AppServices } from '../app.ts';
import { requireActiveLearner } from '../plugins/auth.ts';

type LessonParams = {
  lessonId: string;
};

export function createLessonRoutes(services: AppServices): FastifyPluginAsync {
  return async function lessonRoutes(app) {
    app.get('/:lessonId', { preHandler: requireActiveLearner(services) }, async (request, reply) => {
      const { lessonId } = request.params as LessonParams;
      const { data: lesson, error: lessonError } = await services.supabase!
        .from('lessons')
        .select('id, module_id, title, position, content, estimated_minutes')
        .eq('id', lessonId)
        .eq('status', 'published')
        .maybeSingle();

      if (lessonError) throw lessonError;
      if (!lesson) return reply.code(404).send({ error: 'Lesson not found.' });

      const { data: module, error: moduleError } = await services.supabase!
        .from('modules')
        .select('id, course_id, position')
        .eq('id', lesson.module_id)
        .eq('status', 'published')
        .maybeSingle();

      if (moduleError) throw moduleError;
      if (!module) return reply.code(404).send({ error: 'Lesson not found.' });

      const { data: course, error: courseError } = await services.supabase!
        .from('courses')
        .select('id')
        .eq('id', module.course_id)
        .eq('status', 'published')
        .maybeSingle();

      if (courseError) throw courseError;
      if (!course) return reply.code(404).send({ error: 'Lesson not found.' });

      const { data: earlierModules, error: earlierModuleError } = await services.supabase!
        .from('modules')
        .select('id')
        .eq('course_id', module.course_id)
        .eq('status', 'published')
        .lt('position', module.position)
        .limit(1);

      if (earlierModuleError) throw earlierModuleError;

      if (earlierModules.length > 0) {
        const { data: progress, error: progressError } = await services.supabase!
          .from('user_module_progress')
          .select('module_id')
          .eq('user_id', request.user.id)
          .eq('module_id', module.id)
          .maybeSingle();

        if (progressError) throw progressError;
        if (!progress) return reply.code(403).send({ error: 'Module is locked.' });
      }

      return { lesson };
    });
  };
}
