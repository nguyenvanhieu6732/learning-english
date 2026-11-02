-- Public profile row per auth user (spec "users"), created by trigger on signup.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  current_level text not null default 'easy' check (current_level in ('easy', 'medium', 'hard')),
  current_phase int not null default 1 check (current_phase between 1 and 4),
  created_at timestamptz not null default now(),
  last_active_at timestamptz
);

alter table public.users enable row level security;

create policy users_select_own on public.users for select to authenticated
  using ((select auth.uid()) = id);
create policy users_update_own on public.users for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  lvl text := new.raw_user_meta_data ->> 'current_level';
begin
  insert into public.users (id, email, display_name, avatar_url, current_level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url',
    case when lvl in ('easy', 'medium', 'hard') then lvl else 'easy' end
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
