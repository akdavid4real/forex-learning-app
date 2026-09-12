import type { User } from '@supabase/supabase-js';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { AppServices } from '../app.ts';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

export function requireUser(services: AppServices) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    if (!services.supabase) {
      return reply.code(503).send({
        error: 'Supabase is not configured for this API environment.',
      });
    }

    const authorization = request.headers.authorization;
    const accessToken = authorization?.replace(/^Bearer\s+/i, '');

    if (!accessToken) {
      return reply.code(401).send({ error: 'A bearer token is required.' });
    }

    const { data, error } = await services.supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return reply.code(401).send({ error: 'The bearer token is invalid.' });
    }

    request.user = data.user;
  };
}

export function requireActiveLearner(services: AppServices) {
  const authenticate = requireUser(services);

  return async function authorizeLearner(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    await authenticate(request, reply);

    if (reply.sent) return;

    const { data, error } = await services.supabase!
      .from('profiles')
      .select('access_status')
      .eq('id', request.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return reply.code(403).send({ error: 'Learner profile is not available.' });
    }
    if (data.access_status !== 'active') {
      return reply.code(403).send({
        error:
          data.access_status === 'suspended'
            ? 'Learner access is suspended.'
            : 'Learner access is awaiting approval.',
        access_status: data.access_status,
      });
    }
  };
}

export function requireAdmin(services: AppServices) {
  const authenticate = requireUser(services);

  return async function authorizeAdmin(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    await authenticate(request, reply);

    if (reply.sent) {
      return;
    }

    if (request.user.app_metadata.role !== 'admin') {
      return reply.code(403).send({ error: 'Administrator access is required.' });
    }
  };
}
