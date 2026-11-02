create table public.learning_phases (
  id int primary key,
  name text not null,
  description text,
  order_index int not null,
  estimated_days int,
  daily_minutes int
);

alter table public.learning_phases enable row level security;

create policy learning_phases_read on public.learning_phases for select to authenticated using (true);
