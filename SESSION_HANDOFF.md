# Forex Learning App — Session Handoff

## Original goal

Build a mobile app that teaches forex trading/markets.

## Agreed stack

- Mobile app: React Native, preferably Expo.
- Backend: Fastify.
- Supabase: storage, PostgreSQL database, and authentication only — **not** the primary application backend.

Architecture:

```text
React Native / Expo app
        ↓
Fastify API
        ↓
Supabase
  ├─ Auth
  ├─ Postgres database
  └─ Storage
```

## Backend responsibilities

Fastify should handle:

- APIs for courses, lessons, quizzes, progress, bookmarks, and users.
- Business logic: scores, unlocked modules, streaks, achievements.
- Supabase access-token verification from the mobile app.
- Protected calls to external forex market-data/news APIs.
- Admin-only content management endpoints.
- Future payment and notification webhooks.

Suggested API project structure:

```text
api/
  src/
    app.ts
    server.ts
    plugins/
      supabase.ts
      auth.ts
    modules/
      courses/
      lessons/
      quizzes/
      progress/
      users/
    shared/
      errors/
      schemas/
```

Authentication flow:

1. The React Native app signs in with Supabase Auth.
2. The app includes the returned access token in API requests:

   ```http
   Authorization: Bearer <supabase-access-token>
   ```

3. Fastify validates the token and identifies the user.
4. Fastify performs the requested business logic and reads/writes Supabase data.

Security rule: the Supabase `service_role` key must live only in Fastify environment variables, never in the React Native app.

## Initial data model ideas

```text
profiles
courses
modules
lessons
quizzes
quiz_questions
user_lesson_progress
user_quiz_attempts
bookmarks
```

## Visual direction / colour theme

Recommended: midnight navy + teal + warm gold. The intended feeling is a calm, trustworthy, learning-first finance product rather than a loud trading-signal app.

```text
Background       #0B1220  Midnight navy
Surface          #121C2D  Deep slate
Primary          #14B8A6  Teal
Primary dark     #0F8F82
Accent           #F4B942  Warm gold
Main text        #F8FAFC
Muted text       #94A3B8
Success          #22C55E
Danger           #F05252
```

Usage:

- Teal: primary actions, active tabs, lesson progress, links.
- Gold: streaks, certificates, premium content, key-takeaway cards.
- For forex charts, do not convey gains/losses through red and green alone; include labels, arrows, or patterns for accessibility.

## Requested visual concepts

Create four mobile UI mockup images in the theme above:

1. Home dashboard: daily lesson, learning streak, course-progress ring, and a “Continue learning” CTA.
2. Course roadmap: “Forex Foundations” modules in a clear step-by-step learning path.
3. Interactive lesson: candlestick-chart illustration, key-takeaway card, lesson progress, and “Next lesson.”
4. Quiz/results: multiple-choice forex question, progress indicator, and score/reward state.

## Delivered UI mockups

The four requested mobile UI mockups have been generated and saved in `assets/mockups/`:

- `forex-home-dashboard.png` — daily lesson, streak, course progress, and continuation CTA.
- `forex-course-roadmap.png` — Forex Foundations module path.
- `forex-interactive-lesson.png` — candlestick lesson with a key takeaway card.
- `forex-quiz-results.png` — multiple-choice quiz with a positive score/reward state.

## User preference / tone

- User prefers direct action over lengthy explanations.
- User corrected the initial assumption: Supabase must not be described as the full backend; Fastify is the chosen backend.

## Backend delivery status

The Bun/Fastify API now lives in `api/`. It includes public course discovery,
Supabase token verification, profile and bookmark endpoints, transactional
lesson completion, quiz scoring, XP, streaks, module unlocking, and admin-only
course management.

Database schema and learning-rule migrations are in `supabase/migrations/`.
Apply them in numeric order to the target Supabase project before connecting a
real client. Setup instructions, the endpoint map, and the Expo integration
contract are in `api/README.md`.

The API needs real Supabase environment values to serve database-backed data.
Without them, it deliberately returns `503` for database routes while health
checks remain available.
