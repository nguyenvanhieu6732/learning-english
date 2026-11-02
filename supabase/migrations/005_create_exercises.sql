create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  type text not null check (type in (
    'multiple_choice', 'fill_blank', 'reorder', 'write_sentence',
    'listen_write', 'speak', 'translate', 'explain_grammar'
  )),
  question_json jsonb not null,
  answer_json jsonb not null,
  explanation text,
  order_index int not null,
  points int not null default 10
);

create index exercises_lesson_id_idx on public.exercises (lesson_id, order_index);

alter table public.exercises enable row level security;

create policy exercises_select_own on public.exercises for select to authenticated
  using (exists (
    select 1 from public.lessons l
    where l.id = lesson_id and l.created_by = (select auth.uid())
  ));
create policy exercises_insert_own on public.exercises for insert to authenticated
  with check (exists (
    select 1 from public.lessons l
    where l.id = lesson_id and l.created_by = (select auth.uid())
  ));
