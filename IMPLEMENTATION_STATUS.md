# Implementation Status

This file tracks the MVP-completion branch.

## Product implementation

- [x] Record product decisions
- [x] Restore learner app as native/Expo entry point
- [x] Supabase client/session/auth UI
- [x] Durable mobile session persistence
- [x] API-backed courses and dynamic roadmap
- [x] API-backed lesson loading and completion
- [x] API-backed quizzes, scoring, XP and module unlocks
- [x] Persisted progress/profile/XP/streaks
- [x] Bookmarks in learner UI
- [x] Achievements in learner UI
- [x] Seed a complete three-module Forex Foundations course
- [x] Add learner roadmap/progress contract tests
- [x] Resolve bookmark and achievement API/client contract mismatches
- [x] Production-readiness code pass

## External configuration required for a live environment

These are environment/deployment operations rather than missing product code:

- Apply Supabase migrations `0001`, `0002`, then `0003` to the target project.
- Configure the root Expo environment with `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Configure the Fastify service with its Supabase service-role credentials and allowed origins.
- Deploy the Fastify API as its own service and point `EXPO_PUBLIC_API_URL` at `/api/v1` on that service.

## Deliberate launch scope

The first launch is an education product. Live trade execution, trading signals, paid market-data feeds, push notifications, and in-app payment gating are intentionally not release blockers. They should be added only as separately designed modules after the core learning journey is live and measured.
