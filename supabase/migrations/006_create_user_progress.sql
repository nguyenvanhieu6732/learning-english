create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  completion_percent real not null default 0 check (completion_percent between 0 and 100),
  total_points int not null default 0,
  streak_days int not null default 0,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed', 'mastered')),
  last_studied_at timestamptz,
  unique (user_id, topic_id)
);

create index user_progress_topic_id_idx on public.user_progress (topic_id);

alter table public.user_progress enable row level security;

create policy user_progress_select_own on public.user_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy user_progress_insert_own on public.user_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy user_progress_update_own on public.user_progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
