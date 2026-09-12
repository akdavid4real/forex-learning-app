# MVP Notes

The branch now has the core product architecture in place:

- learner app restored as Expo root
- Supabase auth bootstrap and session restoration
- email/password sign-in and sign-up UI
- centralized API-backed learner data state
- API client coverage for courses, profile, progress, achievements, bookmarks, lesson completion, and quizzes
- mutation helpers that refresh persisted learner state after actions
- roadmap progress helpers

Remaining work on this branch focuses on replacing the last static learner screens with their live-data equivalents, seeding production content, and expanding tests.
