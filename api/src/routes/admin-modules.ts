import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import type { AppServices } from '../app.ts';
import { requireAdmin } from '../plugins/auth.ts';

const contentStatusSchema = z.enum(['draft', 'published']);

const moduleBodySchema = z.object({
  course_id: z.uuid(),
  description: z.string().nullable().optional(),
  position: z.number().int().positive(),
  status: contentStatusSchema,
  title: z.string().min(1).max(200),
});

const lessonBodySchema = z.object({
  content: z.unknown(),
  estimated_minutes: z.number().int().positive(),
  module_id: z.uuid(),
  position: z.number().int().positive(),
  status: contentStatusSchema,
  title: z.string().min(1).max(200),
});

type ResourceParams = {
  resourceId: string;
};

export function createAdminModuleRoutes(
  services: AppServices,
): FastifyPluginAsync {
  return async function adminModuleRoutes(app) {
    app.post('/modules', { preHandler: requireAdmin(services) }, async (request, reply) => {
      const parsedBody = moduleBodySchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'A valid module payload is required.' });
      }

      const { data, error } = await services.supabase!
        .from('modules')
        .insert(parsedBody.data)
        .select('id, course_id, title, description, position, status')
        .single();

      if (error) {
        throw error;
      }

      return reply.code(201).send({ module: data });
    });

    app.patch(
      '/modules/:resourceId',
      { preHandler: requireAdmin(services) },
      async (request, reply) => {
        const parsedBody = moduleBodySchema.partial().safeParse(request.body);

        if (!parsedBody.success || Object.keys(parsedBody.data).length === 0) {
          return reply.code(400).send({ error: 'At least one module field is required.' });
        }

        const { resourceId } = request.params as ResourceParams;
        const { data, error } = await services.supabase!
          .from('modules')
          .update(parsedBody.data)
          .eq('id', resourceId)
          .select('id, course_id, title, description, position, status')
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          return reply.code(404).send({ error: 'Module not found.' });
        }

        return { module: data };
      },
    );

    app.post('/lessons', { preHandler: requireAdmin(services) }, async (request, reply) => {
      const parsedBody = lessonBodySchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'A valid lesson payload is required.' });
      }

      const { data, error } = await services.supabase!
        .from('lessons')
        .insert(parsedBody.data)
        .select('id, module_id, title, position, estimated_minutes, status')
        .single();

      if (error) {
        throw error;
      }

      return reply.code(201).send({ lesson: data });
    });

    app.patch(
      '/lessons/:resourceId',
      { preHandler: requireAdmin(services) },
      async (request, reply) => {
        const parsedBody = lessonBodySchema.partial().safeParse(request.body);

        if (!parsedBody.success || Object.keys(parsedBody.data).length === 0) {
          return reply.code(400).send({ error: 'At least one lesson field is required.' });
        }

        const { resourceId } = request.params as ResourceParams;
        const { data, error } = await services.supabase!
          .from('lessons')
          .update(parsedBody.data)
          .eq('id', resourceId)
          .select('id, module_id, title, position, estimated_minutes, status')
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          return reply.code(404).send({ error: 'Lesson not found.' });
        }

        return { lesson: data };
      },
    );
  };
}
