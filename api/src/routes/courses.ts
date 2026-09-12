import type { FastifyPluginAsync } from 'fastify';
import type { AppServices } from '../app.ts';

export function createCourseRoutes(services: AppServices): FastifyPluginAsync {
  return async function courseRoutes(app) {
    app.get('/', async (_request, reply) => {
      if (!services.supabase) return reply.code(503).send({ error: 'Supabase is not configured for this API environment.' });
      const { data, error } = await services.supabase.from('courses').select('id, slug, title, description').eq('status', 'published').order('created_at');
      if (error) throw error;
      return { courses: data };
    });

    app.get('/:courseId', async (request, reply) => {
      if (!services.supabase) return reply.code(503).send({ error: 'Supabase is not configured for this API environment.' });
      const { courseId } = request.params as { courseId: string };
      const { data: course, error: courseError } = await services.supabase.from('courses').select('id, slug, title, description').eq('id', courseId).eq('status', 'published').maybeSingle();
      if (courseError) throw courseError;
      if (!course) return reply.code(404).send({ error: 'Course not found.' });

      const { data: modules, error: moduleError } = await services.supabase.from('modules').select('id, course_id, title, position, description').eq('course_id', courseId).eq('status', 'published').order('position');
      if (moduleError) throw moduleError;
      const moduleIds = modules.map((module) => module.id);
      if (!moduleIds.length) return { course: { ...course, modules: [] } };

      const [{ data: lessons, error: lessonError }, { data: quizzes, error: quizError }] = await Promise.all([
        services.supabase.from('lessons').select('id, module_id, title, position, estimated_minutes').in('module_id', moduleIds).eq('status', 'published').order('position'),
        services.supabase.from('quizzes').select('id, module_id, title, passing_score, xp_reward').in('module_id', moduleIds).eq('status', 'published'),
      ]);
      if (lessonError) throw lessonError;
      if (quizError) throw quizError;

      return {
        course: {
          ...course,
          modules: modules.map((module) => ({
            ...module,
            lessons: lessons.filter((lesson) => lesson.module_id === module.id),
            quizzes: quizzes.filter((quiz) => quiz.module_id === module.id),
          })),
        },
      };
    });
  };
}
