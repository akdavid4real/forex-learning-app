# Forex Learning App — MVP Product Decisions

This branch treats the product as one application with two surfaces:

1. Public landing / enrollment surface on web.
2. Authenticated learner experience on mobile/native.

## MVP principles

- Fastify remains the source of application business logic.
- Supabase is infrastructure for Auth, Postgres, and Storage.
- Learner progress, XP, streaks, unlocks, achievements, bookmarks, and quiz results are persisted server-side.
- The client must not duplicate learning rules that already exist in the API.
- The app must remain usable in demo mode when backend environment variables are absent, but production builds should use real Supabase + Fastify data.
- The first complete learning path is Forex Foundations.

## Navigation

Authenticated learner tabs:
- Home
- Learn
- Progress
- Profile

Lesson and quiz are drill-in screens from Learn.

## Authentication

Email/password Supabase authentication is the MVP baseline. The app restores an existing session on startup and signs users out locally and in Supabase.

## Content model

The UI renders courses/modules/lessons from API data. Static learner content is retained only as a demo fallback.

## Completion target

A learner can sign up, sign in, open a course, complete lessons, take a quiz, unlock the next module, view persisted progress/XP/streaks, bookmark lessons, and resume later.
