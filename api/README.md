# Forex Learning API

Fastify API for the Expo forex-learning app. Bun runs the server, and Supabase
provides Auth, Postgres, and Storage. The mobile app never receives the
Supabase service-role key.

## Run locally

1. Copy `.env.example` to `.env` and supply the Supabase project values.
2. Apply `supabase/migrations/0001_learning_schema.sql`.
3. Apply `supabase/migrations/0002_learning_rules.sql`.
4. From this directory, run `bun install` and `bun run dev`.

The API listens on `http://localhost:3000` by default. Its health check is
available at `GET /api/v1/health`.

## Authentication

The Expo app signs in directly with Supabase Auth, then passes the session
access token to Fastify:

```http
Authorization: Bearer <access-token>
```

Fastify verifies that token with Supabase before a protected route runs.
Administrative endpoints additionally require `app_metadata.role` to equal
`admin`. Set that claim with trusted server-side Supabase administration only.
The migration also creates a profile automatically for each new Supabase user.

## API routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | Public | Service status |
| GET | `/api/v1/courses` | Public | Published course list |
| GET | `/api/v1/courses/:courseId` | Public | Published course roadmap |
| GET | `/api/v1/lessons/:lessonId` | Signed in | Published lesson content when unlocked |
| GET | `/api/v1/users/me` | Signed in | User profile and learning totals |
| GET | `/api/v1/users/me/achievements` | Signed in | Earned achievements |
| GET | `/api/v1/bookmarks` | Signed in | Saved lessons |
| PUT | `/api/v1/bookmarks/:lessonId` | Signed in | Save a lesson |
| DELETE | `/api/v1/bookmarks/:lessonId` | Signed in | Remove a saved lesson |
| POST | `/api/v1/progress/lessons/:lessonId/complete` | Signed in | Complete a lesson and update XP/streak |
| GET | `/api/v1/progress` | Signed in | Lesson completion and viewing history |
| GET | `/api/v1/quizzes/:quizId` | Signed in | Quiz questions without answer keys |
| POST | `/api/v1/quizzes/:quizId/attempts` | Signed in | Score answers, award XP, unlock next module |
| GET/POST/PATCH | `/api/v1/admin/courses` | Admin | List, create, and edit courses |
| POST/PATCH | `/api/v1/admin/modules` | Admin | Create and edit modules |
| POST/PATCH | `/api/v1/admin/lessons` | Admin | Create and edit lessons |
| POST/PATCH | `/api/v1/admin/quizzes` | Admin | Create and edit quizzes |
| POST/PATCH | `/api/v1/admin/quiz-questions` | Admin | Create and edit quiz questions |
| POST | `/api/v1/admin/lesson-assets/upload-url` | Admin | Get a short-lived upload URL |

The quiz attempt request body is:

```json
{
  "answers": [1, 0, 2]
}
```

Answer values are zero-based indexes, in the same order as the returned quiz
questions.

## Learning rules

- A first completion awards five XP; retries do not award more lesson XP.
- A quiz awards its configured XP reward only for the first passing attempt.
- Completing a first lesson and passing a first quiz each earn a one-time
  achievement reward.
- A passing quiz marks its module complete and unlocks the next published
  module in that course.
- A learner must complete every published lesson in the module before taking
  its quiz.
- The first published module is available immediately. Later modules require
  an unlock record.
- Any learning day maintains or advances the user’s streak.

## Frontend connection

Use a single API base URL in the Expo environment, such as
`EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1`. Add the Supabase session
access token to protected API calls. Do not place
`SUPABASE_SERVICE_ROLE_KEY` in an Expo environment variable, source file, or
release build.

The root `.env.example` shows the Expo-safe public variables. The Supabase anon
key is for Supabase Auth in the mobile client; the API does not need it.

## Supabase Storage

Create a private `lesson-assets` bucket in the Supabase project. An
administrator can request `POST /api/v1/admin/lesson-assets/upload-url` with a
safe object path such as `courses/forex-foundations/chart.png`, then upload the
file directly with the returned short-lived signed URL. The API does not expose
the service-role key to the client.

## Checks

Run `bun run typecheck` and `bun test` from `api/`.
