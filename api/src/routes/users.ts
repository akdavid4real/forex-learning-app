import type { FastifyPluginAsync } from 'fastify';
import type { AppServices } from '../app.ts';
import { requireActiveLearner, requireUser } from '../plugins/auth.ts';

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
