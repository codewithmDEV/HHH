/*
# Add Salah timing statuses

## Overview
Adds a separate status column for each daily prayer so the Salah tracker can record
whether each prayer was completed on time, completed late, or missed.

## Modified Table
Adds to `salah_log`:
- `fajr_status`, `dhuhr_status`, `asr_status`, `maghrib_status`, `isha_status`
- Each status accepts `on_time`, `late`, or `missed` and defaults to `missed`.
- Existing boolean prayer columns remain unchanged for backward compatibility.

## Security
The existing owner-scoped RLS policies on `salah_log` continue to protect these
new columns because they are part of the same table.

## Important Notes
1. No existing columns are removed or changed.
2. Existing records continue to display through their boolean values until updated.
3. New tracker interactions save the richer status values.
*/

ALTER TABLE salah_log ADD COLUMN IF NOT EXISTS fajr_status text NOT NULL DEFAULT 'missed' CHECK (fajr_status IN ('on_time', 'late', 'missed'));
ALTER TABLE salah_log ADD COLUMN IF NOT EXISTS dhuhr_status text NOT NULL DEFAULT 'missed' CHECK (dhuhr_status IN ('on_time', 'late', 'missed'));
ALTER TABLE salah_log ADD COLUMN IF NOT EXISTS asr_status text NOT NULL DEFAULT 'missed' CHECK (asr_status IN ('on_time', 'late', 'missed'));
ALTER TABLE salah_log ADD COLUMN IF NOT EXISTS maghrib_status text NOT NULL DEFAULT 'missed' CHECK (maghrib_status IN ('on_time', 'late', 'missed'));
ALTER TABLE salah_log ADD COLUMN IF NOT EXISTS isha_status text NOT NULL DEFAULT 'missed' CHECK (isha_status IN ('on_time', 'late', 'missed'));