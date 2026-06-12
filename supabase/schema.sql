-- ═══════════════════════════════════════════════════════════════
-- KLAAR — Supabase Database Schema
-- Versie: 1.0.0  |  Datum: 2026-06-12
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- UUID extensie
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────────
-- PROFILES (verlengstuk van auth.users)
-- Wordt automatisch aangemaakt bij registratie via trigger
-- ────────────────────────────────────────────────────────────────
create table public.profiles (
  id                uuid references auth.users(id) on delete cascade primary key,
  email             text,
  restaurant_name   text,
  subscription_tier text default 'trial',       -- trial | starter | pro | full
  trial_started_at  timestamptz default now(),
  created_at        timestamptz default now()
);

-- ────────────────────────────────────────────────────────────────
-- RECIPES (klaar_recipes)
-- id = bestaande client-side string IDs bewaard voor migratie
-- ────────────────────────────────────────────────────────────────
create table public.recipes (
  id          text         primary key,           -- bv. "demo_rec_01" of "rec_1686000000000"
  user_id     uuid         references auth.users(id) on delete cascade not null,
  title       text         not null,
  folder      text         default 'keuken',
  status      text         default 'draft',        -- draft | complete
  type        text         default 'savoury',      -- savoury | sweet | drink
  allergens   jsonb        default '[]'::jsonb,    -- [{code, name, maybe}]
  recipe      jsonb        default '{}'::jsonb,    -- {prep, cook, servings, ingredients[], steps[], notes}
  created_at  timestamptz  default now(),
  updated_at  timestamptz  default now()
);

-- ────────────────────────────────────────────────────────────────
-- INGREDIENTS (klaar_ingredienten)
-- ────────────────────────────────────────────────────────────────
create table public.ingredients (
  id           text        primary key,            -- bv. "ing_01"
  user_id      uuid        references auth.users(id) on delete cascade not null,
  naam         text        not null,
  inkoopprijs  numeric(10,4) default 0,
  eenheid      text        default 'kg',           -- kg | g | l | ml | stuk
  leverancier  text,
  categorie    text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ────────────────────────────────────────────────────────────────
-- HACCP LOGS (klaar_haccp_log)
-- ────────────────────────────────────────────────────────────────
create table public.haccp_logs (
  id          uuid         default uuid_generate_v4() primary key,
  user_id     uuid         references auth.users(id) on delete cascade not null,
  type        text         not null,               -- temperatuur | ontvangst | reiniging | ccp
  data        jsonb        default '{}'::jsonb,
  logged_at   timestamptz  default now()
);

-- ────────────────────────────────────────────────────────────────
-- API USAGE (voor verbruik-tracking en facturering)
-- ────────────────────────────────────────────────────────────────
create table public.api_usage (
  id             uuid     default uuid_generate_v4() primary key,
  user_id        uuid     references auth.users(id) on delete cascade not null,
  model          text,
  input_tokens   integer  default 0,
  output_tokens  integer  default 0,
  module         text,                             -- '01-recept-studio' etc.
  created_at     timestamptz default now()
);

-- ────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY — elke gebruiker ziet alleen eigen data
-- ────────────────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.recipes     enable row level security;
alter table public.ingredients enable row level security;
alter table public.haccp_logs  enable row level security;
alter table public.api_usage   enable row level security;

-- Profiles
create policy "eigen profiel lezen"    on public.profiles for select using (auth.uid() = id);
create policy "eigen profiel updaten"  on public.profiles for update using (auth.uid() = id);

-- Recipes
create policy "eigen recepten lezen"   on public.recipes for select using (auth.uid() = user_id);
create policy "eigen recepten maken"   on public.recipes for insert with check (auth.uid() = user_id);
create policy "eigen recepten updaten" on public.recipes for update using (auth.uid() = user_id);
create policy "eigen recepten wissen"  on public.recipes for delete using (auth.uid() = user_id);

-- Ingredients
create policy "eigen ing lezen"    on public.ingredients for select using (auth.uid() = user_id);
create policy "eigen ing maken"    on public.ingredients for insert with check (auth.uid() = user_id);
create policy "eigen ing updaten"  on public.ingredients for update using (auth.uid() = user_id);
create policy "eigen ing wissen"   on public.ingredients for delete using (auth.uid() = user_id);

-- HACCP logs
create policy "eigen haccp lezen"  on public.haccp_logs for select using (auth.uid() = user_id);
create policy "eigen haccp maken"  on public.haccp_logs for insert with check (auth.uid() = user_id);
create policy "eigen haccp wissen" on public.haccp_logs for delete using (auth.uid() = user_id);

-- API usage (alleen lezen, schrijven via service role in Edge Function)
create policy "eigen usage lezen"  on public.api_usage for select using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- TRIGGER: profiel aanmaken bij registratie
-- ────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────────
-- TRIGGER: updated_at automatisch bijwerken
-- ────────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute procedure update_updated_at();

create trigger ingredients_updated_at
  before update on public.ingredients
  for each row execute procedure update_updated_at();
