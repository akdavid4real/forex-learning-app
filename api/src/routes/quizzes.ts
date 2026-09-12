import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import type { AppServices } from '../app.ts';
import { requireUser } from '../plugins/auth.ts';

const submitQuizBodySchema = z.object({
  answers: z.array(z.number().int().nonnegative()),
});

type QuizParams = { quizId: string };

export function createQuizRoutes(services: AppServices): FastifyPluginAsync {
  return async function quizRoutes(app) {
    app.get('/:quizId', { preHandler: requireUser(services) }, async (request, reply) => {
      const { quizId } = request.params as QuizParams;
      const { data, error } = await services.supabase!
        .from('quizzes')
        .select('id, module_id, title, passing_score')
        .eq('id', quizId)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      if (!data) return reply.code(404).send({ error: 'Quiz not found.' });

      const { data: module, error: moduleError } = await services.supabase!
        .from('modules')
        .select('id, course_id, position')
        .eq('id', data.module_id)
        .eq('status', 'published')
        .maybeSingle();
      if (moduleError) throw moduleError;
      if (!module) return reply.code(404).send({ error: 'Quiz not found.' });

      const { data: course, error: courseError } = await services.supabase!
        .from('courses')
        .select('id')
        .eq('id', module.course_id)
        .eq('status', 'published')
        .maybeSingle();
      if (courseError) throw courseError;
      if (!course) return reply.code(404).send({ error: 'Quiz not found.' });

      const { data: earlierModules, error: earlierModuleError } = await services.supabase!
        .from('modules')
        .select('id')
        .eq('course_id', module.course_id)
        .eq('status', 'published')
        .lt('position', module.position)
        .limit(1);
      if (earlierModuleError) throw earlierModuleError;

      if (earlierModules.length > 0) {
        const { data: moduleProgress, error: moduleProgressError } = await services.supabase!
          .from('user_module_progress')
          .select('module_id')
          .eq('user_id', request.user.id)
          .eq('module_id', module.id)
          .maybeSingle();
        if (moduleProgressError) throw moduleProgressError;
        if (!moduleProgress) return reply.code(403).send({ error: 'Module is locked.' });
      }

      const { data: lessonRows, error: lessonError } = await services.supabase!
        .from('lessons')
        .select('id')
        .eq('module_id', module.id)
        .eq('status', 'published');
      if (lessonError) throw lessonError;

      if (lessonRows.length > 0) {
        const lessonIds = lessonRows.map((lesson) => lesson.id);
        const { data: completedRows, error: completionError } = await services.supabase!
          .from('user_lesson_progress')
          .select('lesson_id')
          .eq('user_id', request.user.id)
          .in('lesson_id', lessonIds)
          .not('completed_at', 'is', null);
        if (completionError) throw completionError;
        if (completedRows.length !== lessonIds.length) {
          return reply.code(403).send({ error: 'Complete every lesson in this module before taking its quiz.' });
        }
      }

      const { data: questions, error: questionError } = await services.supabase!
        .from('quiz_questions')
        .select('id, position, prompt, answers, explanation')
        .eq('quiz_id', quizId)
        .order('position');
      if (questionError) throw questionError;

      return { quiz: { ...data, quiz_questions: questions } };
    });

    app.post('/:quizId/attempts', { preHandler: requireUser(services) }, async (request, reply) => {
      const parsedBody = submitQuizBodySchema.safeParse(request.body);
      if (!parsedBody.success) return reply.code(400).send({ error: 'Quiz answers must be an array of answer indexes.' });
      const { quizId } = request.params as QuizParams;
      const { data, error } = await services.supabase!.rpc('submit_quiz_attempt', {
        submitted_answers: parsedBody.data.answers,
        target_quiz_id: quizId,
        target_user_id: request.user.id,
      });
      if (error) throw error;
      return { attempt: data?.[0] };
    });
  };
}
