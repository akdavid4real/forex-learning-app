# MVP Notes

The learner MVP is now implemented on `complete-product-mvp`.

## Completed

- Expo learner application is the startup surface.
- Supabase email/password authentication and durable device session restoration.
- Fastify-backed courses, roadmap, lessons, quizzes, progress, bookmarks, profile, XP, streaks, achievements, and module unlocking.
- Dynamic learning flow replaces the original hard-coded Currency Pairs completion state.
- Locked-module protection is enforced on lesson reads, quiz reads, and quiz submission.
- Bookmark and achievement response contracts are aligned with the mobile client.
- A complete, idempotent Forex Foundations seed migration ships three modules, six lessons, three quizzes, and nine questions.
- Learner contract tests cover roadmap quiz metadata and persisted lesson/module/quiz progress.
- Offline/demo data remains available when live environment values are absent.

## Deployment boundary

The Expo client and Fastify API remain separate deployable surfaces. The root Vercel configuration exports the Expo web bundle; it does not deploy the Fastify service. Production therefore requires a separately hosted Fastify API plus the Supabase migrations and environment variables documented in `IMPLEMENTATION_STATUS.md` and `api/README.md`.

## Deliberate post-MVP work

Broker connectivity, live trade execution, signals, paid real-time market/news feeds, push notifications, and in-app payment gating are not part of this launch scope. The first release is intentionally a structured forex education product.
