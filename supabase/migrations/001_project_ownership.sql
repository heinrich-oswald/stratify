create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

create policy "profiles_are_private_to_owner"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "projects_are_private_to_owner"
on public.projects
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create index if not exists projects_owner_id_idx on public.projects (owner_id);
