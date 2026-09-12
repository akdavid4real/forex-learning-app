# Forex Learning App — MVP Product Decisions

This branch treats the product as a learning platform first with two intentional surfaces from the same Expo codebase:

- **Web:** the existing public Forex Learning marketing/enrollment experience.
- **iOS/Android:** the authenticated learner product.

The platform-aware root preserves the public `uefatraders.com` experience instead of replacing it with an authenticated app shell.

## Architecture

- React Native / Expo is the shared client foundation.
- Fastify remains the source of application business logic.
- Supabase is infrastructure for Auth, Postgres, and Storage only.
- The Supabase service-role key never ships in the Expo app.
- Learner progress, XP, streaks, unlocks, achievements, bookmarks, and quiz results are persisted server-side.
- The client may display lock/completion state, but the API/database remains authoritative for progression rules.
- The Fastify API is deployed as a separate service from the root Expo web export.

## Launch learning experience

Authenticated learner navigation:
- Home
- Learn
- Progress
- Profile

Lesson and quiz screens drill into the selected course/module. Course content is dynamic API data; static content exists only as an offline/demo fallback.

The first complete learning path is **Forex Foundations** with three modules:
1. Market Foundations
2. Risk Before Reward
3. Building a Trading Process

## Authentication

Email/password Supabase authentication is the launch baseline. Sessions persist on device, restore on startup, and are invalidated through Supabase sign-out.

## Product safety and positioning

- This is an educational product, not a trading-signal service.
- The product does not execute trades or promise returns.
- Learning content emphasizes capital protection, risk, process, and uncertainty rather than hype or guaranteed outcomes.
- Public marketing and any future market-data surface should include a visible educational/risk disclaimer.

## Explicit non-blockers for launch

The following are intentionally separate post-MVP modules and must not delay the core learner release:

- Live trade execution or broker connectivity.
- Trading signals/copy trading.
- Paid real-time market-data feeds or news licensing.
- Push-notification automation.
- In-app payment gating/subscriptions.

The existing landing/enrollment flow can continue handling commercial enrollment externally until payments are designed as a dedicated module with entitlement state owned by Fastify rather than the payment provider.

## Completion target

A learner can create an account, sign in, open a course, complete lessons, take scored quizzes, unlock the next module, earn XP/achievements, maintain a streak, bookmark lessons, view progress, sign out, and resume later on a restored session, while the public website continues to handle discovery and enrollment.
