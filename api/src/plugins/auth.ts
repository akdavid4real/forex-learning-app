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
