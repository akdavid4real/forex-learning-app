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
- [x] Password reset request + native recovery deep-link handling, including PKCE callbacks
- [x] Native app scheme, Android package, iOS bundle identifier, and release version metadata
- [x] EAS development/preview/production build profiles with remote version management
- [x] Mobile app error boundary and retry screen
- [x] Production splash presentation
- [x] Android hardware-back navigation behavior
- [x] Offline detection, request timeouts, safe GET retry, and reconnect refresh
- [x] Refresh learner/account state after returning from background
- [x] Learner profile editing
- [x] In-app Privacy, Support, and About surfaces
- [x] Self-contained Android/iOS EAS release scripts
- [x] Remove superseded branch-only prototype learner components
- [x] API-backed courses and dynamic roadmap
- [x] API-backed lesson loading and completion
- [x] API-backed quizzes, scoring, XP and module unlocks
- [x] Persisted progress/profile/XP/streaks
- [x] Bookmarks in learner UI
- [x] Achievements in learner UI
- [x] Seed a complete three-module Forex Foundations course
- [x] Add learner roadmap/progress/access/profile contract tests
- [x] Resolve bookmark and achievement API/client contract mismatches
- [x] Protect quiz reads with module/lesson eligibility checks
- [x] Persist completion for the implicitly unlocked first module
- [x] Require exactly one submitted answer per quiz question
- [x] Learner access entitlement: pending, active, suspended
- [x] Production-readiness code pass

## External configuration required for a live environment

These are environment/deployment operations rather than missing product code:

- Apply Supabase migrations `0001` through `0005` to the target project.
- Add `forexlearning://auth/reset-password` to the allowed Supabase Auth redirect URLs so password recovery can return to the installed app.
- Configure the root Expo environment with `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Configure `EXPO_PUBLIC_SUPPORT_EMAIL` for the mobile Support screen.
- Configure the public enrollment display values: `EXPO_PUBLIC_PAYMENT_BANK_NAME`, `EXPO_PUBLIC_PAYMENT_ACCOUNT_NAME`, `EXPO_PUBLIC_PAYMENT_ACCOUNT_NUMBER`, and `EXPO_PUBLIC_PAYMENT_WHATSAPP_NUMBER`.
- Configure the Fastify service with its Supabase service-role credentials and allowed origins.
- Deploy the Fastify API as its own service and point `EXPO_PUBLIC_API_URL` at `/api/v1` on that service.
- Regenerate the root Bun lockfile with a Vercel-compatible Bun version after installing the final Expo/mobile dependencies. Current Vercel builds re-resolve dependencies when the committed lockfile format is unsupported.
- Run a real Android preview build and iOS build, then verify password recovery, session restoration, pending/active access, profile editing, lesson completion, quiz unlocks, offline/reconnect behavior, foreground refresh, and hardware back-navigation.
- Publish an external privacy-policy URL for Google Play/App Store metadata. The in-app privacy summary is not a substitute for the store listing URL.

## Deliberate launch scope

The first launch is an education product. Live trade execution, trading signals, paid market-data feeds, push notifications, and in-app payment gating are intentionally not release blockers. They should be added only as separately designed modules after the core learning journey is live and measured.
