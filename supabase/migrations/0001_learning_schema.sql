create extension if not exists "pgcrypto";

create type public.content_status as enum ('draft', 'published');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  xp integer not null default 0 check (xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_learning_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  description text,
  status public.content_status not null default 'draft',
  unique (course_id, position)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  content jsonb not null default '{}'::jsonb,
  estimated_minutes integer not null default 5 check (estimated_minutes > 0),
  status public.content_status not null default 'draft',
  unique (module_id, position)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null unique references public.modules(id) on delete cascade,
  title text not null,
  passing_score integer not null default 70 check (passing_score between 0 and 100),
  xp_reward integer not null default 20 check (xp_reward >= 0),
  status public.content_status not null default 'draft'
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position integer not null check (position > 0),
  prompt text not null,
  answers jsonb not null,
  correct_answer_index integer not null check (correct_answer_index >= 0),
  explanation text,
  unique (quiz_id, position)
);

create table public.user_lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_viewed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.user_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  answers jsonb not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

create table public.user_module_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, module_id)
);

create table public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  xp_reward integer not null default 0 check (xp_reward >= 0)
);

create table public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create index user_quiz_attempts_user_id_created_at_index
  on public.user_quiz_attempts (user_id, created_at desc);

create index user_lesson_progress_user_id_index
  on public.user_lesson_progress (user_id);

alter table public.profiles enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_quiz_attempts enable row level security;
alter table public.user_module_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.user_achievements enable row level security;
