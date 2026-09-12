# Client architecture

The client is intentionally thin. Authentication comes from Supabase, while learning state and rules come from the Fastify API.

- `session-context.tsx` — Supabase session lifecycle
- `learner-data-context.tsx` — query/cache layer for learner state
- `services/forex-api.ts` — Fastify transport contract
- `use-live-learner.ts` — learner mutations with automatic refresh
- `roadmap-utils.ts` — pure progress helpers
- `demo-data.ts` — explicit offline/demo fallback only
