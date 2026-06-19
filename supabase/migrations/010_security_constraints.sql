-- ============================================================
-- Migration 010 — Security constraints
-- Adds CHECK constraints to prevent:
--   • Score forgery (total_correct > total_questions)
--   • Instant-submit bots (time_spent_seconds < 5)
--   • Oversized display names, team names, descriptions via API
-- Uses NOT VALID so existing rows are not checked retroactively.
-- Run VALIDATE CONSTRAINT later once old data is confirmed clean.
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── sessions: score integrity & minimum time ─────────────────────────────────
ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_score_valid
  CHECK (total_correct >= 0 AND total_correct <= total_questions AND total_questions > 0)
  NOT VALID;

ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_time_min
  CHECK (time_spent_seconds IS NULL OR time_spent_seconds >= 5)
  NOT VALID;

-- ── users: display_name length ───────────────────────────────────────────────
ALTER TABLE public.users
  ADD CONSTRAINT users_display_name_length
  CHECK (display_name IS NULL OR char_length(display_name) <= 50)
  NOT VALID;

-- ── teams: name and description length ───────────────────────────────────────
ALTER TABLE public.teams
  ADD CONSTRAINT teams_name_length
  CHECK (char_length(name) >= 1 AND char_length(name) <= 80)
  NOT VALID;

ALTER TABLE public.teams
  ADD CONSTRAINT teams_description_length
  CHECK (description IS NULL OR char_length(description) <= 200)
  NOT VALID;
