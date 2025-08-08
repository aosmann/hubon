-- NextAuth core tables for Postgres (no Prisma required)
-- Creates: users, accounts, sessions, verification_token, credentials (for email/password)

begin;

create extension if not exists "pgcrypto";

-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text,
  role text not null default 'user', -- 'user' | 'creator' (for admin templates)
  created_at timestamptz not null default now()
);

-- Accounts (OAuth providers)
create table if not exists public.accounts (
  id bigserial primary key,
  "userId" uuid not null references public.users(id) on delete cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  created_at timestamptz not null default now(),
  unique(provider, "providerAccountId")
);

-- Sessions
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  "sessionToken" text not null unique,
  "userId" uuid not null references public.users(id) on delete cascade,
  expires timestamptz not null,
  created_at timestamptz not null default now()
);

-- Verification tokens (email magic links, etc.)
create table if not exists public."verification_token" (
  identifier text not null,
  token text not null,
  expires timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (identifier, token)
);

-- Credentials (email/password) - store password hash per user
create table if not exists public.credentials (
  user_id uuid primary key references public.users(id) on delete cascade,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists users_email_idx on public.users (email);
create index if not exists accounts_user_idx on public.accounts ("userId");
create index if not exists sessions_user_idx on public.sessions ("userId");
create index if not exists sessions_token_idx on public.sessions ("sessionToken");

commit;
