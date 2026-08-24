import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import type { AppServices } from '../app.ts';
import { requireAdmin } from '../plugins/auth.ts';

const contentStatusSchema = z.enum(['draft', 'published']);

const quizBodySchema = z.object({
  module_id: z.uuid(),
  passing_score: z.number().int().min(0).max(100),
  status: contentStatusSchema,
  title: z.string().min(1).max(200),
  xp_reward: z.number().int().nonnegative(),
});

const questionBodySchema = z
  .object({
    answers: z.array(z.unknown()).min(2),
    correct_answer_index: z.number().int().nonnegative(),
    explanation: z.string().nullable().optional(),
    position: z.number().int().positive(),
    prompt: z.string().min(1),
    quiz_id: z.uuid(),
  })
  .superRefine((question, context) => {
    if (question.correct_answer_index >= question.answers.length) {
      context.addIssue({
        code: 'custom',
        message: 'The correct answer index must exist in the answers array.',
        path: ['correct_answer_index'],
      });
    }
  });

type ResourceParams = {
  resourceId: string;
};

export function createAdminQuizRoutes(
  services: AppServices,
): FastifyPluginAsync {
  return async function adminQuizRoutes(app) {
    app.post('/quizzes', { preHandler: requireAdmin(services) }, async (request, reply) => {
      const parsedBody = quizBodySchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'A valid quiz payload is required.' });
      }

      const { data, error } = await services.supabase!
        .from('quizzes')
        .insert(parsedBody.data)
        .select('id, module_id, title, passing_score, xp_reward, status')
        .single();

      if (error) {
        throw error;
      }

      return reply.code(201).send({ quiz: data });
    });

    app.patch(
      '/quizzes/:resourceId',
      { preHandler: requireAdmin(services) },
      async (request, reply) => {
        const parsedBody = quizBodySchema.partial().safeParse(request.body);

        if (!parsedBody.success || Object.keys(parsedBody.data).length === 0) {
          return reply.code(400).send({ error: 'At least one quiz field is required.' });
        }

        const { resourceId } = request.params as ResourceParams;
        const { data, error } = await services.supabase!
          .from('quizzes')
          .update(parsedBody.data)
          .eq('id', resourceId)
          .select('id, module_id, title, passing_score, xp_reward, status')
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          return reply.code(404).send({ error: 'Quiz not found.' });
        }

        return { quiz: data };
      },
    );

    app.post('/quiz-questions', { preHandler: requireAdmin(services) }, async (request, reply) => {
      const parsedBody = questionBodySchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'A valid quiz-question payload is required.' });
      }

      const { data, error } = await services.supabase!
        .from('quiz_questions')
        .insert(parsedBody.data)
        .select('id, quiz_id, position, prompt, answers, explanation')
        .single();

      if (error) {
        throw error;
      }

      return reply.code(201).send({ question: data });
    });

    app.patch(
      '/quiz-questions/:resourceId',
      { preHandler: requireAdmin(services) },
      async (request, reply) => {
        const parsedBody = questionBodySchema.partial().safeParse(request.body);

        if (!parsedBody.success || Object.keys(parsedBody.data).length === 0) {
          return reply.code(400).send({ error: 'At least one quiz-question field is required.' });
        }

        const { resourceId } = request.params as ResourceParams;
        const { data, error } = await services.supabase!
          .from('quiz_questions')
          .update(parsedBody.data)
          .eq('id', resourceId)
          .select('id, quiz_id, position, prompt, answers, explanation')
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          return reply.code(404).send({ error: 'Quiz question not found.' });
        }

        return { question: data };
      },
    );
  };
}
