create table public.lesson_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  score real not null check (score between 0 and 100),
  time_spent_seconds int not null default 0 check (time_spent_seconds >= 0),
  answers_json jsonb,
  ai_feedback text,
  completed_at timestamptz not null default now()
);

create index lesson_history_user_idx on public.lesson_history (user_id, completed_at desc);
create index lesson_history_lesson_id_idx on public.lesson_history (lesson_id);

alter table public.lesson_history enable row level security;

create policy lesson_history_select_own on public.lesson_history for select to authenticated
  using ((select auth.uid()) = user_id);
create policy lesson_history_insert_own on public.lesson_history for insert to authenticated
  with check ((select auth.uid()) = user_id);
