-- Run once in Supabase Dashboard > SQL Editor.
create table if not exists public.rooms (
  code text primary key check (code ~ '^[0-9]{8}$'),
  data jsonb not null,
  version integer not null default 0,
  expires_at timestamptz not null
);

-- Upgrade the earlier Supabase schema if the project already has a rooms table.
alter table public.rooms add column if not exists expires_at timestamptz;
update public.rooms set expires_at = now() where expires_at is null;
alter table public.rooms alter column expires_at set not null;

create index if not exists rooms_expires_at_idx on public.rooms (expires_at);
alter table public.rooms enable row level security;
grant all on public.rooms to service_role;

-- Remove an existing cleanup job before creating it again, so this script is safe to rerun.
create extension if not exists pg_cron;
select cron.unschedule(jobid)
from cron.job
where jobname = 'muvie-expired-room-cleanup';

select cron.schedule(
  'muvie-expired-room-cleanup',
  '*/15 * * * *',
  $$delete from public.rooms where expires_at <= now();$$
);
