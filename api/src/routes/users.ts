import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import type { AppServices } from '../app.ts';
import { requireActiveLearner, requireUser } from '../plugins/auth.ts';

const profileUpdateSchema = z.object({
  display_name: z.string().trim().min(2).max(80),
});

export function createUserRoutes(services: AppServices): FastifyPluginAsync {
  return async function userRoutes(app) {
    app.get('/me', { preHandler: requireUser(services) }, async (request) => {
      const { data, error } = await services.supabase!
        .from('profiles')
        .select('id, display_name, avatar_url, xp, current_streak, longest_streak, access_status')
        .eq('id', request.user.id)
        .maybeSingle();
      if (error) throw error;
      return { profile: data, user: { email: request.user.email, id: request.user.id } };
    });

    app.patch('/me', { preHandler: requireUser(services) }, async (request, reply) => {
      const parsedBody = profileUpdateSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'Display name must be between 2 and 80 characters.' });
      }

      const { data, error } = await services.supabase!
        .from('profiles')
        .update({ display_name: parsedBody.data.display_name, updated_at: new Date().toISOString() })
        .eq('id', request.user.id)
        .select('id, display_name, avatar_url, xp, current_streak, longest_streak, access_status')
        .maybeSingle();
      if (error) throw error;
      if (!data) return reply.code(404).send({ error: 'Learner profile not found.' });
      return { profile: data };
    });

    app.get('/me/achievements', { preHandler: requireActiveLearner(services) }, async (request) => {
      const { data, error } = await services.supabase!
        .from('user_achievements')
        .select('earned_at, achievements(id, slug, title, description, xp_reward)')
        .eq('user_id', request.user.id)
        .order('earned_at', { ascending: false });
      if (error) throw error;
      return {
        achievements: (data ?? []).flatMap((row) => {
          const achievement = Array.isArray(row.achievements) ? row.achievements[0] : row.achievements;
          return achievement ? [{ ...achievement, earned_at: row.earned_at }] : [];
        }),
      };
    });
  };
}
