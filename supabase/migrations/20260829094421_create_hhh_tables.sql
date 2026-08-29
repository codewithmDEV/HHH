/*
# Create HHH (Halal Habits & Heart) Database Schema

## Overview
This migration creates the complete database schema for the HHH app — a single-tenant
(no auth) Islamic spiritual companion app. All data is intentionally shared/public,
so RLS policies allow anon + authenticated CRUD on every table.

## New Tables

1. **intentions** — User's intentions (goals they nurture over time)
   - id (uuid PK), title, description, category (deen/dunya/balance),
     focus_areas (text[]), reflection, is_nurtured, created_at, updated_at

2. **nurture_log** — Daily nurture check-ins for intentions
   - id (uuid PK), intention_id (FK), log_date, note, created_at
   - Unique constraint on (intention_id, log_date) to prevent duplicates

3. **salah_log** — Daily prayer tracker (5 prayers)
   - id (uuid PK), log_date, fajr, dhuhr, asr, maghrib, isha (booleans),
     note, created_at
   - Unique constraint on log_date

4. **journal_entries** — Reflection journal
   - id (uuid PK), title, content, mood (enum), linked_intention_id (nullable FK),
     created_at

5. **community_posts** — Community sharing
   - id (uuid PK), author_name, content, category (enum), hearts (int), created_at

6. **sponsorships** — Orphan sponsorship commitments
   - id (uuid PK), orphanage_name, orphanage_location, amount (numeric),
     frequency (monthly/one_time), is_active, started_at, note

7. **guidance_chats** — Saved guidance Q&A history
   - id (uuid PK), question, response, sources (text[]), created_at

## Security
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant app with no sign-in screen — all data is intentionally
  shared/public.
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE).

## Important Notes
1. No user_id columns — this is a single-tenant app with no auth.
2. All tables use gen_random_uuid() for primary keys.
3. Timestamps default to now().
4. Foreign keys use ON DELETE CASCADE for child tables.
*/

-- Intentions table
CREATE TABLE IF NOT EXISTS intentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'balance' CHECK (category IN ('deen', 'dunya', 'balance')),
  focus_areas text[] NOT NULL DEFAULT '{}',
  reflection text NOT NULL DEFAULT '',
  is_nurtured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_intentions" ON intentions;
CREATE POLICY "anon_select_intentions" ON intentions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_intentions" ON intentions;
CREATE POLICY "anon_insert_intentions" ON intentions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_intentions" ON intentions;
CREATE POLICY "anon_update_intentions" ON intentions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_intentions" ON intentions;
CREATE POLICY "anon_delete_intentions" ON intentions FOR DELETE
  TO anon, authenticated USING (true);

-- Nurture log table
CREATE TABLE IF NOT EXISTS nurture_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intention_id uuid NOT NULL REFERENCES intentions(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (intention_id, log_date)
);
ALTER TABLE nurture_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_nurture_log" ON nurture_log;
CREATE POLICY "anon_select_nurture_log" ON nurture_log FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_nurture_log" ON nurture_log;
CREATE POLICY "anon_insert_nurture_log" ON nurture_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_nurture_log" ON nurture_log;
CREATE POLICY "anon_update_nurture_log" ON nurture_log FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_nurture_log" ON nurture_log;
CREATE POLICY "anon_delete_nurture_log" ON nurture_log FOR DELETE
  TO anon, authenticated USING (true);

-- Salah log table
CREATE TABLE IF NOT EXISTS salah_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date date NOT NULL,
  fajr boolean NOT NULL DEFAULT false,
  dhuhr boolean NOT NULL DEFAULT false,
  asr boolean NOT NULL DEFAULT false,
  maghrib boolean NOT NULL DEFAULT false,
  isha boolean NOT NULL DEFAULT false,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (log_date)
);
ALTER TABLE salah_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_salah_log" ON salah_log;
CREATE POLICY "anon_select_salah_log" ON salah_log FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_salah_log" ON salah_log;
CREATE POLICY "anon_insert_salah_log" ON salah_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_salah_log" ON salah_log;
CREATE POLICY "anon_update_salah_log" ON salah_log FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_salah_log" ON salah_log;
CREATE POLICY "anon_delete_salah_log" ON salah_log FOR DELETE
  TO anon, authenticated USING (true);

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL,
  mood text NOT NULL DEFAULT 'reflective' CHECK (mood IN ('grateful', 'reflective', 'striving', 'peaceful', 'struggling')),
  linked_intention_id uuid REFERENCES intentions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_journal" ON journal_entries;
CREATE POLICY "anon_select_journal" ON journal_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_journal" ON journal_entries;
CREATE POLICY "anon_insert_journal" ON journal_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_journal" ON journal_entries;
CREATE POLICY "anon_update_journal" ON journal_entries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_journal" ON journal_entries;
CREATE POLICY "anon_delete_journal" ON journal_entries FOR DELETE
  TO anon, authenticated USING (true);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'reflection' CHECK (category IN ('reflection', 'question', 'encouragement', 'experience')),
  hearts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_community" ON community_posts;
CREATE POLICY "anon_select_community" ON community_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_community" ON community_posts;
CREATE POLICY "anon_insert_community" ON community_posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_community" ON community_posts;
CREATE POLICY "anon_update_community" ON community_posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_community" ON community_posts;
CREATE POLICY "anon_delete_community" ON community_posts FOR DELETE
  TO anon, authenticated USING (true);

-- Sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  orphanage_name text NOT NULL,
  orphanage_location text NOT NULL DEFAULT '',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'one_time')),
  is_active boolean NOT NULL DEFAULT true,
  started_at timestamptz NOT NULL DEFAULT now(),
  note text NOT NULL DEFAULT ''
);
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sponsorships" ON sponsorships;
CREATE POLICY "anon_select_sponsorships" ON sponsorships FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sponsorships" ON sponsorships;
CREATE POLICY "anon_insert_sponsorships" ON sponsorships FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sponsorships" ON sponsorships;
CREATE POLICY "anon_update_sponsorships" ON sponsorships FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sponsorships" ON sponsorships;
CREATE POLICY "anon_delete_sponsorships" ON sponsorships FOR DELETE
  TO anon, authenticated USING (true);

-- Guidance chats table
CREATE TABLE IF NOT EXISTS guidance_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  response text NOT NULL,
  sources text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE guidance_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_guidance" ON guidance_chats;
CREATE POLICY "anon_select_guidance" ON guidance_chats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_guidance" ON guidance_chats;
CREATE POLICY "anon_insert_guidance" ON guidance_chats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_guidance" ON guidance_chats;
CREATE POLICY "anon_update_guidance" ON guidance_chats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_guidance" ON guidance_chats;
CREATE POLICY "anon_delete_guidance" ON guidance_chats FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_nurture_log_intention_id ON nurture_log(intention_id);
CREATE INDEX IF NOT EXISTS idx_nurture_log_log_date ON nurture_log(log_date);
CREATE INDEX IF NOT EXISTS idx_salah_log_log_date ON salah_log(log_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_guidance_chats_created_at ON guidance_chats(created_at);