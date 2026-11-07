-- Run this once in Supabase Dashboard > SQL Editor.
create table if not exists public.rooms (
  code text primary key check (code ~ '^[0-9]{8}$'),
  data jsonb not null,
  version integer not null default 0
);

-- The application accesses this table only from its server using the service role key.
-- Keep browser access disabled; do not create anon/authenticated policies.
alter table public.rooms enable row level security;
