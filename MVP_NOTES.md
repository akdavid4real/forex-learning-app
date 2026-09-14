# MVP Notes

The launch MVP is implemented on `complete-product-mvp` with two intentional product surfaces.

## Product surfaces

- **Web:** public Forex Learning marketing and manual enrollment.
- **iOS/Android:** authenticated learner application.

The platform-aware entry point preserves the public website on web while native builds open the learner product.

## Completed

- Safe public enrollment flow with no NIN, fake email verification, or browser-only referral state.
- Manual payment verification through configured bank details and the official WhatsApp proof number.
- Payment enrollment fails closed when official payment details are not configured.
- Visible forex-risk and education-only positioning on the public surface.
- Supabase email/password authentication and durable device session restoration.
- Fastify-backed courses, roadmap, lessons, quizzes, progress, bookmarks, profile, XP, streaks, achievements, and module unlocking.
- Dynamic learning flow replaces the original hard-coded Currency Pairs completion state.
- Locked-module protection is enforced on lesson reads, quiz reads, and quiz submission.
- Quiz answer indexes and answer-revealing explanations remain private before submission.
- Bookmark and achievement response contracts are aligned with the mobile client.
- A complete, idempotent Forex Foundations seed migration ships three modules, six lessons, three quizzes, and nine questions.
- Migration `0004` reliably persists completion of the implicitly unlocked first module and requires exactly one submitted answer per quiz question.
- Learner contract tests cover roadmap quiz metadata and persisted lesson/module/quiz progress.
- Offline/demo learner data remains available when live environment values are absent.
- Expo starter branding has been replaced with Forex Learning branding.

## Deployment boundary

The root Vercel project exports the Expo web surface. It does not deploy the Fastify service. A live learner environment therefore requires the Fastify API to be deployed separately, Supabase migrations `0001` through `0004` to be applied, and the documented environment variables to be configured.

The public payment form also requires the four `EXPO_PUBLIC_PAYMENT_*` display values. Until they are configured, the form intentionally tells visitors not to send money.

The committed root Bun lockfile is currently ignored by Vercel because its lockfile format is not recognized by Vercel's Bun runtime. Builds can still complete by re-resolving dependencies, but the lockfile should be regenerated with a compatible Bun version before production promotion.

## Deliberate post-MVP work

Broker connectivity, live trade execution, signals/copy trading, paid real-time market/news feeds, push notifications, and in-app payment gating are not part of this launch scope. The first release is intentionally a structured forex education product.
