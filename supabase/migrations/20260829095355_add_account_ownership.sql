/*
# Add account ownership for private HHH records

## Overview
Adds Supabase account ownership to personal HHH data now that the app has a sign-in
screen. Each signed-in person will see only their own spiritual records.

## Modified Tables
Adds `user_id` to:
- `intentions` — the account that created the intention
- `nurture_log` — the account that recorded the nurture check-in
- `salah_log` — the account that recorded the prayer day
- `journal_entries` — the account that wrote the reflection
- `sponsorships` — the account that created the sponsorship commitment
- `guidance_chats` — the account that saved the guidance conversation

Existing rows are preserved. New rows receive the current signed-in account from
`auth.uid()` automatically.

## Security Changes
- Replaces public anon CRUD policies on the six personal tables with authenticated,
  owner-scoped SELECT, INSERT, UPDATE, and DELETE policies.
- Nurture records are additionally checked against the owning intention.
- Community posts remain shared and public because they represent the community feed.

## Important Notes
1. The app requires a signed-in account before personal records can be read or written.
2. No custom users table is created; Supabase Auth remains the source of identity.
3. No existing table or column is dropped or renamed.
*/

ALTER TABLE intentions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE nurture_log ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE salah_log ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE sponsorships ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE guidance_chats ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

DROP POLICY IF EXISTS "anon_select_intentions" ON intentions;
DROP POLICY IF EXISTS "anon_insert_intentions" ON intentions;
DROP POLICY IF EXISTS "anon_update_intentions" ON intentions;
DROP POLICY IF EXISTS "anon_delete_intentions" ON intentions;
CREATE POLICY "select_own_intentions" ON intentions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_intentions" ON intentions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_intentions" ON intentions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_intentions" ON intentions FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_select_nurture_log" ON nurture_log;
DROP POLICY IF EXISTS "anon_insert_nurture_log" ON nurture_log;
DROP POLICY IF EXISTS "anon_update_nurture_log" ON nurture_log;
DROP POLICY IF EXISTS "anon_delete_nurture_log" ON nurture_log;
CREATE POLICY "select_own_nurture_log" ON nurture_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_nurture_log" ON nurture_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM intentions WHERE intentions.id = nurture_log.intention_id AND intentions.user_id = auth.uid()));
CREATE POLICY "update_own_nurture_log" ON nurture_log FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_nurture_log" ON nurture_log FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_select_salah_log" ON salah_log;
DROP POLICY IF EXISTS "anon_insert_salah_log" ON salah_log;
DROP POLICY IF EXISTS "anon_update_salah_log" ON salah_log;
DROP POLICY IF EXISTS "anon_delete_salah_log" ON salah_log;
CREATE POLICY "select_own_salah_log" ON salah_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_salah_log" ON salah_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_salah_log" ON salah_log FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_salah_log" ON salah_log FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_select_journal" ON journal_entries;
DROP POLICY IF EXISTS "anon_insert_journal" ON journal_entries;
DROP POLICY IF EXISTS "anon_update_journal" ON journal_entries;
DROP POLICY IF EXISTS "anon_delete_journal" ON journal_entries;
CREATE POLICY "select_own_journal" ON journal_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_journal" ON journal_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_journal" ON journal_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_journal" ON journal_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_select_sponsorships" ON sponsorships;
DROP POLICY IF EXISTS "anon_insert_sponsorships" ON sponsorships;
DROP POLICY IF EXISTS "anon_update_sponsorships" ON sponsorships;
DROP POLICY IF EXISTS "anon_delete_sponsorships" ON sponsorships;
CREATE POLICY "select_own_sponsorships" ON sponsorships FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_sponsorships" ON sponsorships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_sponsorships" ON sponsorships FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_sponsorships" ON sponsorships FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_select_guidance" ON guidance_chats;
DROP POLICY IF EXISTS "anon_insert_guidance" ON guidance_chats;
DROP POLICY IF EXISTS "anon_update_guidance" ON guidance_chats;
DROP POLICY IF EXISTS "anon_delete_guidance" ON guidance_chats;
CREATE POLICY "select_own_guidance" ON guidance_chats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_guidance" ON guidance_chats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_guidance" ON guidance_chats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_guidance" ON guidance_chats FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_intentions_user_id ON intentions(user_id);
CREATE INDEX IF NOT EXISTS idx_nurture_log_user_id ON nurture_log(user_id);
CREATE INDEX IF NOT EXISTS idx_salah_log_user_id ON salah_log(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_user_id ON sponsorships(user_id);
CREATE INDEX IF NOT EXISTS idx_guidance_chats_user_id ON guidance_chats(user_id);