-- Hubon application tables: brand_guides, templates, jobs, events
-- Note on RLS:
-- - We enable public read for published templates.
-- - Write operations on all tables are limited to the service role.
-- - brand_guides/jobs/events are server-managed via API (service role).

begin;

create extension if not exists "pgcrypto";

-- Brand guides captured after onboarding
create table if not exists public.brand_guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  logo_url text,
  palette jsonb not null,      -- { primary, secondary, background, text }
  fonts jsonb not null,        -- { heading, body }
  voice jsonb,                 -- { tone, keywords[] }
  created_at timestamptz not null default now()
);

-- Templates authored by creators/admin
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,          -- "flyer","social","poster","story"
  ratios text[] not null,          -- ["1:1","4:5","16:9","9:16"]
  engine text not null,            -- "image","text","mixed"
  schema jsonb not null,           -- JSON schema of editable fields
  prompt jsonb not null,           -- locked guidance; do not inject brand/user text here
  overlays jsonb,                  -- default overlay config
  created_by uuid,                 -- references users(id) if desired
  published boolean default true,
  created_at timestamptz not null default now()
);

-- Render jobs (generate/edit/reference)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  template_id uuid not null references public.templates(id) on delete cascade,
  brand_id uuid not null references public.brand_guides(id) on delete cascade,
  status text not null,            -- "queued","running","succeeded","failed"
  input jsonb not null,            -- concrete values for schema
  output jsonb,                    -- urls, seeds, metadata
  created_at timestamptz not null default now()
);

-- Basic telemetry events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  type text not null,              -- "auth","template_used","job_completed", etc.
  data jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists brand_guides_user_idx on public.brand_guides (user_id);
create index if not exists templates_slug_idx on public.templates (slug);
create index if not exists templates_category_idx on public.templates (category);
create index if not exists jobs_user_idx on public.jobs (user_id);
create index if not exists jobs_template_idx on public.jobs (template_id);
create index if not exists events_type_idx on public.events (type);

-- RLS
alter table public.brand_guides enable row level security;
alter table public.templates enable row level security;
alter table public.jobs enable row level security;
alter table public.events enable row level security;

-- Templates: public read for published templates
drop policy if exists "templates public read" on public.templates;
create policy "templates public read"
on public.templates for select
to public
using (published = true);

-- Templates: service role can write
drop policy if exists "templates service write" on public.templates;
create policy "templates service write"
on public.templates for all
to service_role
using (true)
with check (true);

-- Brand guides: service role only (server-managed)
drop policy if exists "brand_guides service all" on public.brand_guides;
create policy "brand_guides service all"
on public.brand_guides for all
to service_role
using (true)
with check (true);

-- Jobs: service role only (server-managed)
drop policy if exists "jobs service all" on public.jobs;
create policy "jobs service all"
on public.jobs for all
to service_role
using (true)
with check (true);

-- Events: service role only (server-managed)
drop policy if exists "events service all" on public.events;
create policy "events service all"
on public.events for all
to service_role
using (true)
with check (true);

commit;
