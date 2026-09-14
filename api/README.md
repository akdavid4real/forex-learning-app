# Forex Learning API

Fastify API for the Expo forex-learning app. Bun runs the service; Supabase provides Auth, Postgres, and Storage. Application decisions stay in Fastify/database functions, and the Supabase service-role key never ships to the client.

## Run locally

1. Copy `api/.env.example` to `api/.env` and provide the target Supabase values.
2. Apply these migrations in order from the repository root:
   - `supabase/migrations/0001_learning_schema.sql`
   - `supabase/migrations/0002_learning_rules.sql`
   - `supabase/migrations/0003_seed_forex_foundations.sql`
   - `supabase/migrations/0004_fix_module_completion.sql`
   - `supabase/migrations/0005_learner_access.sql`
3. From `api/`, run `bun install`.
4. Run `bun run typecheck` and `bun test`.
5. Start the API with `bun run dev`.

The default local service is `http://localhost:3000`; health is `GET /api/v1/health`.

## Authentication and access

The Expo client authenticates directly with Supabase Auth and sends the resulting access token to Fastify:

```http
Authorization: Bearer <access-token>
```

Fastify verifies the token before protected routes execute. Learner accounts have an application-owned `access_status` of `pending`, `active`, or `suspended`. Course discovery and `/users/me` are available to signed-in pending accounts, but lessons, quizzes, progress, bookmarks, and achievements require `active` access. Admin routes additionally require `app_metadata.role = "admin"`; assign that claim only from trusted server-side administration.

## Learner API

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | Public | Service status |
| GET | `/api/v1/courses` | Public | Published course list |
| GET | `/api/v1/courses/:courseId` | Public | Roadmap with modules, lesson summaries, and quiz metadata |
| GET | `/api/v1/users/me` | Signed in | Profile, XP, streak totals, and learner access status |
| PATCH | `/api/v1/users/me` | Signed in | Update learner display name |
| GET | `/api/v1/lessons/:lessonId` | Active learner | Full lesson content when its module is unlocked |
| GET | `/api/v1/users/me/achievements` | Active learner | Flattened earned achievements |
| GET | `/api/v1/bookmarks` | Active learner | Saved lessons, including `lesson_id` |
| PUT | `/api/v1/bookmarks/:lessonId` | Active learner | Save a lesson |
| DELETE | `/api/v1/bookmarks/:lessonId` | Active learner | Remove a saved lesson |
| GET | `/api/v1/progress` | Active learner | Persisted lesson, module, and quiz progress |
| POST | `/api/v1/progress/lessons/:lessonId/complete` | Active learner | Complete a lesson and update XP/streak |
| GET | `/api/v1/quizzes/:quizId` | Active learner | Quiz questions after module/lesson eligibility checks |
| POST | `/api/v1/quizzes/:quizId/attempts` | Active learner | Score answers, award XP, complete/unlock modules |

Admin content routes remain under `/api/v1/admin` for courses, modules, lessons, quizzes, quiz questions, signed lesson-asset uploads, and learner access management. The admin learner endpoints list learner profiles and update `access_status` after enrollment/payment review.

## Progress response

`GET /api/v1/progress` returns the three state groups the learner client needs:

```json
{
  "lessons": [],
  "modules": [],
  "quizzes": []
}
```

The client uses these records to display completion and locks, but the server/database remains authoritative.

## Learning rules

- First lesson completion awards five lesson XP; retrying does not award it again.
- First lesson completion can award the one-time first-lesson achievement.
- A quiz is unavailable until every published lesson in its module is completed.
- Later modules are unavailable until their unlock record exists.
- Quiz submissions must contain exactly one answer for every question.
- A quiz awards its configured XP only for the first passing attempt.
- First quiz pass can award the one-time first-quiz achievement.
- Passing upserts completion for the current module (including the implicitly unlocked first module) and unlocks the next published module.
- Learning activity updates the current and longest streak.
- Quiz answer keys and answer-revealing explanations never leave the pre-attempt API response.

## Frontend connection

Set the Expo-safe variables shown in the root `.env.example`:

```text
EXPO_PUBLIC_API_URL=https://your-api.example.com/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in Expo variables, source code, or release builds.

## Deployment boundary

The repository root `vercel.json` exports the Expo web application. It does **not** deploy this Fastify server. Deploy `api/` as its own service, configure its Supabase service-role credentials and `ALLOWED_ORIGINS`, then point `EXPO_PUBLIC_API_URL` to that deployment.

## Storage

Create a private Supabase bucket named `lesson-assets`. Admins can request a short-lived signed upload URL through `POST /api/v1/admin/lesson-assets/upload-url`; clients never receive the service-role key.

## Release checks

From `api/`:

```bash
bun run typecheck
bun test
```

From the repository root after dependencies are installed:

```bash
bun run typecheck
npx expo export --platform web
```
