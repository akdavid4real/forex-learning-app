create or replace function public.ensure_profile_exists(target_user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.profiles (id)
  values (target_user_id)
  on conflict (id) do nothing;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;

create trigger create_profile_after_signup
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();

insert into public.achievements (slug, title, description, xp_reward)
values
  (
    'first_lesson',
    'First lesson complete',
    'Complete your first forex lesson.',
    10
  ),
  (
    'first_quiz',
    'First quiz passed',
    'Pass your first forex quiz.',
    25
  )
on conflict (slug) do nothing;

create table public.user_quiz_rewards (
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, quiz_id)
);

alter table public.user_quiz_rewards enable row level security;

create or replace function public.record_lesson_completion(
  target_user_id uuid,
  target_lesson_id uuid
)
returns table (
  awarded_xp integer,
  current_streak integer,
  completed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  earned_lesson_xp boolean := false;
  lesson_module_id uuid;
  lesson_course_id uuid;
  lesson_module_position integer;
  achievement_xp integer := 0;
  today date := current_date;
begin
  perform public.ensure_profile_exists(target_user_id);

  select module.id, module.course_id, module.position
  into lesson_module_id, lesson_course_id, lesson_module_position
  from public.lessons as lesson
  join public.modules as module on module.id = lesson.module_id
  join public.courses as course on course.id = module.course_id
  where lesson.id = target_lesson_id
    and lesson.status = 'published'
    and module.status = 'published'
    and course.status = 'published';

  if not found then
    raise exception 'Lesson not found.' using errcode = 'P0002';
  end if;

  if exists (
    select 1
    from public.modules as earlier_module
    where earlier_module.course_id = lesson_course_id
      and earlier_module.status = 'published'
      and earlier_module.position < lesson_module_position
  ) and not exists (
    select 1
    from public.user_module_progress as module_progress
    where module_progress.user_id = target_user_id
      and module_progress.module_id = lesson_module_id
  ) then
    raise exception 'Module is locked.' using errcode = 'P0001';
  end if;

  insert into public.user_lesson_progress (
    user_id,
    lesson_id,
    completed_at,
    last_viewed_at
  )
  values (
    target_user_id,
    target_lesson_id,
    now(),
    now()
  )
  on conflict (user_id, lesson_id) do update
  set completed_at = excluded.completed_at,
      last_viewed_at = excluded.last_viewed_at
  where public.user_lesson_progress.completed_at is null
  returning true into earned_lesson_xp;

  if not found then
    update public.user_lesson_progress
    set last_viewed_at = now()
    where user_id = target_user_id
      and lesson_id = target_lesson_id;
  end if;

  update public.profiles
  set xp = xp + case when earned_lesson_xp then 5 else 0 end,
      current_streak = case
        when last_learning_date = today then current_streak
        when last_learning_date = today - 1 then current_streak + 1
        else 1
      end,
      longest_streak = greatest(
        longest_streak,
        case
          when last_learning_date = today then current_streak
          when last_learning_date = today - 1 then current_streak + 1
          else 1
        end
      ),
      last_learning_date = today,
      updated_at = now()
  where id = target_user_id
  returning case when earned_lesson_xp then 5 else 0 end,
    public.profiles.current_streak
  into awarded_xp, current_streak;

  select progress.completed_at
  into completed_at
  from public.user_lesson_progress as progress
  where progress.user_id = target_user_id
    and progress.lesson_id = target_lesson_id;

  if earned_lesson_xp then
    with earned_achievement as (
      insert into public.user_achievements (user_id, achievement_id)
      select target_user_id, achievement.id
      from public.achievements as achievement
      where achievement.slug = 'first_lesson'
      on conflict (user_id, achievement_id) do nothing
      returning achievement_id
    )
    select coalesce(sum(achievement.xp_reward), 0)
    into achievement_xp
    from public.achievements as achievement
    join earned_achievement on earned_achievement.achievement_id = achievement.id;

    update public.profiles
    set xp = xp + achievement_xp,
        updated_at = now()
    where id = target_user_id;
  end if;

  awarded_xp := awarded_xp + achievement_xp;

  return next;
end;
$$;

create or replace function public.submit_quiz_attempt(
  target_user_id uuid,
  target_quiz_id uuid,
  submitted_answers jsonb
)
returns table (
  attempt_id uuid,
  score integer,
  passed boolean,
  awarded_xp integer,
  unlocked_module_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quiz_record public.quizzes%rowtype;
  question_count integer;
  correct_count integer;
  earned_quiz_xp boolean := false;
  next_module_id uuid;
  quiz_course_id uuid;
  quiz_module_position integer;
  achievement_xp integer := 0;
begin
  if jsonb_typeof(submitted_answers) <> 'array' then
    raise exception 'Quiz answers must be an array.';
  end if;

  perform public.ensure_profile_exists(target_user_id);

  select quiz.*
  into quiz_record
  from public.quizzes as quiz
  join public.modules as module on module.id = quiz.module_id
  join public.courses as course on course.id = module.course_id
  where quiz.id = target_quiz_id
    and quiz.status = 'published'
    and module.status = 'published'
    and course.status = 'published';

  if not found then
    raise exception 'Quiz not found.' using errcode = 'P0002';
  end if;

  select course_id, position
  into quiz_course_id, quiz_module_position
  from public.modules
  where id = quiz_record.module_id;

  if exists (
    select 1
    from public.modules as earlier_module
    where earlier_module.course_id = quiz_course_id
      and earlier_module.status = 'published'
      and earlier_module.position < quiz_module_position
  ) and not exists (
    select 1
    from public.user_module_progress as module_progress
    where module_progress.user_id = target_user_id
      and module_progress.module_id = quiz_record.module_id
  ) then
    raise exception 'Module is locked.' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from public.lessons as lesson
    where lesson.module_id = quiz_record.module_id
      and lesson.status = 'published'
      and not exists (
        select 1
        from public.user_lesson_progress as progress
        where progress.user_id = target_user_id
          and progress.lesson_id = lesson.id
          and progress.completed_at is not null
      )
  ) then
    raise exception 'Complete every lesson in this module before the quiz.'
      using errcode = 'P0001';
  end if;

  select count(*)
  into question_count
  from public.quiz_questions
  where quiz_id = target_quiz_id;

  if question_count = 0 then
    raise exception 'Quiz has no questions.';
  end if;

  select count(*)
  into correct_count
  from public.quiz_questions as question
  where question.quiz_id = target_quiz_id
    and submitted_answers ->> (question.position - 1)::text =
      question.correct_answer_index::text;

  score := floor((correct_count::numeric / question_count) * 100);
  passed := score >= quiz_record.passing_score;
  insert into public.user_quiz_attempts (
    user_id,
    quiz_id,
    score,
    answers,
    passed
  )
  values (
    target_user_id,
    target_quiz_id,
    score,
    submitted_answers,
    passed
  )
  returning id into attempt_id;

  if passed then
    insert into public.user_quiz_rewards (user_id, quiz_id)
    values (target_user_id, target_quiz_id)
    on conflict (user_id, quiz_id) do nothing
    returning true into earned_quiz_xp;
  end if;

  if not found then
    earned_quiz_xp := false;
  end if;

  awarded_xp := case when earned_quiz_xp then quiz_record.xp_reward else 0 end;

  if earned_quiz_xp then
    update public.profiles
    set xp = xp + awarded_xp,
        updated_at = now()
    where id = target_user_id;
  end if;

  if passed then
    with earned_achievement as (
      insert into public.user_achievements (user_id, achievement_id)
      select target_user_id, achievement.id
      from public.achievements as achievement
      where achievement.slug = 'first_quiz'
      on conflict (user_id, achievement_id) do nothing
      returning achievement_id
    )
    select coalesce(sum(achievement.xp_reward), 0)
    into achievement_xp
    from public.achievements as achievement
    join earned_achievement on earned_achievement.achievement_id = achievement.id;

    update public.profiles
    set xp = xp + achievement_xp,
        updated_at = now()
    where id = target_user_id;
  end if;

  awarded_xp := awarded_xp + achievement_xp;

  if passed then
    update public.user_module_progress
    set completed_at = coalesce(completed_at, now())
    where user_id = target_user_id
      and module_id = quiz_record.module_id;

    select module.id
    into next_module_id
    from public.modules as current_module
    join public.modules as module
      on module.course_id = current_module.course_id
      and module.position = current_module.position + 1
    where current_module.id = quiz_record.module_id
      and module.status = 'published';

    if next_module_id is not null then
      insert into public.user_module_progress (user_id, module_id)
      values (target_user_id, next_module_id)
      on conflict (user_id, module_id) do nothing;
    end if;
  end if;

  unlocked_module_id := next_module_id;
  return next;
end;
$$;

grant execute on function public.record_lesson_completion(uuid, uuid) to service_role;
grant execute on function public.submit_quiz_attempt(uuid, uuid, jsonb) to service_role;
