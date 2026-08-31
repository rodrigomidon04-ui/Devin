-- Segunda versión: categorías, orden manual, PDF/video y perfil editable.
-- Ejecutalo en Supabase → SQL Editor → New query → Run (después de schema.sql).

alter table public.items add column if not exists category text;
alter table public.items add column if not exists position integer;

alter table public.items drop constraint if exists items_kind_check;
alter table public.items add constraint items_kind_check
  check (kind in ('image', 'text', 'link', 'pdf', 'video'));

create table if not exists public.profile (
  id integer primary key default 1 check (id = 1),
  title text,
  subtitle text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

insert into public.profile (id) values (1) on conflict (id) do nothing;

alter table public.profile enable row level security;

drop policy if exists "profile_public_read" on public.profile;
create policy "profile_public_read" on public.profile
  for select using (true);

drop policy if exists "profile_owner_update" on public.profile;
create policy "profile_owner_update" on public.profile
  for update to authenticated
  using (public.is_portfolio_owner())
  with check (public.is_portfolio_owner());

drop policy if exists "profile_owner_insert" on public.profile;
create policy "profile_owner_insert" on public.profile
  for insert to authenticated with check (public.is_portfolio_owner());
