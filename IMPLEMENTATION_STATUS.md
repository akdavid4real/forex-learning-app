# Implementation Status

This file tracks the MVP-completion branch.

## Product implementation

- [x] Record product decisions
- [x] Preserve public web enrollment while native launches the learner app
- [x] Remove NIN, fake email verification, and browser-only referral enrollment fields
- [x] Make payment enrollment manual and fail closed when official payment details are missing
- [x] Add visible education/forex-risk positioning to the public surface
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
- [x] Protect quiz reads with module/lesson eligibility checks
- [x] Persist completion for the implicitly unlocked first module
- [x] Require exactly one submitted answer per quiz question
- [x] Production-readiness code pass

## External configuration required for a live environment

These are environment/deployment operations rather than missing product code:

- Apply Supabase migrations `0001`, `0002`, `0003`, then `0004` to the target project.
- Configure the root Expo environment with `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Configure the public enrollment display values: `EXPO_PUBLIC_PAYMENT_BANK_NAME`, `EXPO_PUBLIC_PAYMENT_ACCOUNT_NAME`, `EXPO_PUBLIC_PAYMENT_ACCOUNT_NUMBER`, and `EXPO_PUBLIC_PAYMENT_WHATSAPP_NUMBER`.
- Configure the Fastify service with its Supabase service-role credentials and allowed origins.
- Deploy the Fastify API as its own service and point `EXPO_PUBLIC_API_URL` at `/api/v1` on that service.
- Regenerate the root Bun lockfile with a Vercel-compatible Bun version. Current Vercel builds complete, but the committed lockfile format is ignored and dependencies are re-resolved.

## Deliberate launch scope

The first launch is an education product. Live trade execution, trading signals, paid market-data feeds, push notifications, and in-app payment gating are intentionally not release blockers. They should be added only as separately designed modules after the core learning journey is live and measured.
