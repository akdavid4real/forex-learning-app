import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import type { AppServices } from '../app.ts';
import { requireAdmin } from '../plugins/auth.ts';

const courseBodySchema = z.object({
  description: z.string().min(1),
  slug: z.string().min(1).max(100),
  status: z.enum(['draft', 'published']),
  title: z.string().min(1).max(200),
});

const uploadUrlBodySchema = z.object({
  path: z
    .string()
    .min(1)
    .max(500)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9/_-]*\.[a-zA-Z0-9]+$/),
});

type CourseParams = {
  courseId: string;
};

export function createAdminRoutes(services: AppServices): FastifyPluginAsync {
  return async function adminRoutes(app) {
    app.get('/courses', { preHandler: requireAdmin(services) }, async () => {
      const { data, error } = await services.supabase!
        .from('courses')
        .select('id, slug, title, description, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { courses: data };
    });

    app.post('/courses', { preHandler: requireAdmin(services) }, async (request, reply) => {
      const parsedBody = courseBodySchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'A valid course payload is required.' });
      }

      const { data, error } = await services.supabase!
        .from('courses')
        .insert(parsedBody.data)
        .select('id, slug, title, description, status')
        .single();

      if (error) {
        throw error;
      }

      return reply.code(201).send({ course: data });
    });

    app.patch(
      '/courses/:courseId',
      { preHandler: requireAdmin(services) },
      async (request, reply) => {
        const parsedBody = courseBodySchema.partial().safeParse(request.body);

        if (!parsedBody.success || Object.keys(parsedBody.data).length === 0) {
          return reply.code(400).send({ error: 'At least one course field is required.' });
        }

        const { courseId } = request.params as CourseParams;
        const { data, error } = await services.supabase!
          .from('courses')
          .update({
            ...parsedBody.data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', courseId)
          .select('id, slug, title, description, status')
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          return reply.code(404).send({ error: 'Course not found.' });
        }

        return { course: data };
      },
    );

    app.post(
      '/lesson-assets/upload-url',
      { preHandler: requireAdmin(services) },
      async (request, reply) => {
        const parsedBody = uploadUrlBodySchema.safeParse(request.body);

        if (!parsedBody.success) {
          return reply.code(400).send({
            error: 'A safe lesson-asset path with a file extension is required.',
          });
        }

        const { data, error } = await services.supabase!.storage
          .from('lesson-assets')
          .createSignedUploadUrl(parsedBody.data.path);

        if (error) {
          throw error;
        }

        return reply.code(201).send({ upload: data });
      },
    );
  };
}
