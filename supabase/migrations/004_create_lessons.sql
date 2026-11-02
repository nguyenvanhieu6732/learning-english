create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics (id) on delete set null, -- null = custom topic typed by the user
  created_by uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content_json jsonb not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  skill_type text not null default 'reading' check (skill_type in ('listening', 'speaking', 'reading', 'writing')),
  lesson_type text not null default 'practice' check (lesson_type in ('theory', 'practice', 'test', 'review')),
  estimated_minutes int,
  created_at timestamptz not null default now()
);

create index lessons_created_by_idx on public.lessons (created_by, created_at desc);
create index lessons_topic_id_idx on public.lessons (topic_id);

alter table public.lessons enable row level security;

create policy lessons_select_own on public.lessons for select to authenticated
  using ((select auth.uid()) = created_by);
create policy lessons_insert_own on public.lessons for insert to authenticated
  with check ((select auth.uid()) = created_by);
create policy lessons_delete_own on public.lessons for delete to authenticated
  using ((select auth.uid()) = created_by);
