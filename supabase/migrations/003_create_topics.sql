create table public.topics (
  id uuid primary key default gen_random_uuid(),
  phase_id int not null references public.learning_phases (id),
  name text not null,
  description text,
  slug text not null unique,
  order_index int not null,
  difficulty text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  is_custom boolean not null default false
);

create index topics_phase_id_idx on public.topics (phase_id, order_index);

alter table public.topics enable row level security;

-- shortcut: only seeded (non-custom) topics are readable; custom lessons use lessons.topic_id = null. Add created_by here if users ever save their own topics.
create policy topics_read on public.topics for select to authenticated using (not is_custom);
