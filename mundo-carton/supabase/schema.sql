-- Ejecutá TODO este archivo en Supabase → SQL Editor → New query → Run.
-- IMPORTANTE: cambiá el correo de abajo por el tuyo (el usuario que creaste en
-- Authentication). Solo ese correo va a poder cargar o borrar contenido.

create extension if not exists "pgcrypto";

create or replace function public.is_carton_owner()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'TU-CORREO@ejemplo.com'
$$;

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  category text not null
    check (category in ('juguetes', 'muebles', 'decoracion', 'trucos')),
  video_url text not null,
  storage_path text
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  description text,
  category text not null
    check (category in ('juguetes', 'muebles', 'decoracion', 'didacticos')),
  price integer not null check (price > 0),
  age_range text,
  image_url text,
  storage_path text
);

alter table public.videos enable row level security;
alter table public.products enable row level security;

-- Cualquiera puede ver los videos y los productos.
drop policy if exists "videos_public_read" on public.videos;
create policy "videos_public_read" on public.videos
  for select using (true);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

-- Solo el dueño puede crear, editar o borrar.
drop policy if exists "videos_owner_insert" on public.videos;
create policy "videos_owner_insert" on public.videos
  for insert to authenticated with check (public.is_carton_owner());

drop policy if exists "videos_owner_update" on public.videos;
create policy "videos_owner_update" on public.videos
  for update to authenticated
  using (public.is_carton_owner())
  with check (public.is_carton_owner());

drop policy if exists "videos_owner_delete" on public.videos;
create policy "videos_owner_delete" on public.videos
  for delete to authenticated using (public.is_carton_owner());

drop policy if exists "products_owner_insert" on public.products;
create policy "products_owner_insert" on public.products
  for insert to authenticated with check (public.is_carton_owner());

drop policy if exists "products_owner_update" on public.products;
create policy "products_owner_update" on public.products
  for update to authenticated
  using (public.is_carton_owner())
  with check (public.is_carton_owner());

drop policy if exists "products_owner_delete" on public.products;
create policy "products_owner_delete" on public.products
  for delete to authenticated using (public.is_carton_owner());

-- Bucket público para los videos subidos y las fotos de los productos.
insert into storage.buckets (id, name, public)
values ('mundo-carton', 'mundo-carton', true)
on conflict (id) do update set public = true;

drop policy if exists "carton_public_read" on storage.objects;
create policy "carton_public_read" on storage.objects
  for select using (bucket_id = 'mundo-carton');

drop policy if exists "carton_owner_insert" on storage.objects;
create policy "carton_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'mundo-carton' and public.is_carton_owner());

drop policy if exists "carton_owner_update" on storage.objects;
create policy "carton_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'mundo-carton' and public.is_carton_owner())
  with check (bucket_id = 'mundo-carton' and public.is_carton_owner());

drop policy if exists "carton_owner_delete" on storage.objects;
create policy "carton_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'mundo-carton' and public.is_carton_owner());
