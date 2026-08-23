-- Ejecutá TODO este archivo en Supabase → SQL Editor → New query → Run.
-- IMPORTANTE: cambiá el correo de abajo por el tuyo (el usuario que creaste en
-- Authentication). Solo ese correo va a poder subir o borrar cosas.

create extension if not exists "pgcrypto";

create or replace function public.is_portfolio_owner()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'TU-CORREO@ejemplo.com'
$$;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  kind text not null check (kind in ('image', 'text', 'link')),
  url text,
  storage_path text,
  file_name text,
  mime_type text,
  size_bytes bigint
);

alter table public.items enable row level security;

-- Cualquiera puede ver el portfolio.
drop policy if exists "items_public_read" on public.items;
create policy "items_public_read" on public.items
  for select using (true);

-- Solo el dueño puede crear, editar o borrar.
drop policy if exists "items_auth_insert" on public.items;
create policy "items_auth_insert" on public.items
  for insert to authenticated with check (public.is_portfolio_owner());

drop policy if exists "items_auth_update" on public.items;
create policy "items_auth_update" on public.items
  for update to authenticated
  using (public.is_portfolio_owner())
  with check (public.is_portfolio_owner());

drop policy if exists "items_auth_delete" on public.items;
create policy "items_auth_delete" on public.items
  for delete to authenticated using (public.is_portfolio_owner());

-- Bucket público para los archivos (PNG, TXT, etc.).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio_public_read" on storage.objects;
create policy "portfolio_public_read" on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists "portfolio_auth_insert" on storage.objects;
create policy "portfolio_auth_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_portfolio_owner());

drop policy if exists "portfolio_auth_update" on storage.objects;
create policy "portfolio_auth_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_owner())
  with check (bucket_id = 'portfolio' and public.is_portfolio_owner());

drop policy if exists "portfolio_auth_delete" on storage.objects;
create policy "portfolio_auth_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_owner());
