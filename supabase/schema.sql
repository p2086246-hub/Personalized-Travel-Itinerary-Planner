-- Roamly / Supabase database schema
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists travel_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  destination text not null,
  days integer not null check (days between 1 and 30),
  travelers integer not null default 1,
  budget text not null default 'Comfort',
  interests text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  destination text not null,
  days integer not null,
  travelers integer not null default 1,
  budget text not null default 'Comfort',
  interests text[] not null default '{}',
  itinerary jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists trips_created_at_idx on trips(created_at desc);

-- For a classroom/demo deployment, enable RLS and add policies appropriate
-- to your authentication strategy before exposing private user data.
alter table profiles enable row level security;
alter table travel_preferences enable row level security;
alter table trips enable row level security;