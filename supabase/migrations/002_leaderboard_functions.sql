-- ============================================================
-- Migration 002 — Leaderboard Functions
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================
-- The sessions table has RLS (users can only SELECT their own rows).
-- SECURITY DEFINER functions run as the function owner (postgres),
-- bypassing RLS so they can aggregate data across all users safely.
--
-- Uses auth.users (not public.users) because auth.users is always
-- populated by Supabase Auth — public.users only exists if a custom
-- trigger was set up to mirror rows into it.
-- ============================================================

-- ── Overall leaderboard ───────────────────────────────────────────────────────
-- Returns one row per user: total questions, correct answers, accuracy, sessions.
DROP FUNCTION IF EXISTS public.get_leaderboard_overall();
CREATE OR REPLACE FUNCTION public.get_leaderboard_overall()
RETURNS TABLE (
  user_id           uuid,
  username          text,
  sessions_played   bigint,
  questions_answered bigint,
  questions_correct  bigint,
  accuracy_pct      numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    u.id,
    COALESCE(
      NULLIF(u.raw_user_meta_data->>'display_name', ''),
      split_part(u.email, '@', 1)
    )::text AS username,
    COUNT(s.id)            AS sessions_played,
    SUM(s.total_questions) AS questions_answered,
    SUM(s.total_correct)   AS questions_correct,
    ROUND(
      SUM(s.total_correct)::numeric
      / NULLIF(SUM(s.total_questions), 0) * 100,
    1)                     AS accuracy_pct
  FROM auth.users u
  JOIN public.sessions s ON s.user_id = u.id
  GROUP BY u.id, u.email, u.raw_user_meta_data
  ORDER BY 6 DESC, 4 DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard_overall() TO anon, authenticated;


-- ── Per-quiz leaderboard ──────────────────────────────────────────────────────
-- Returns one row per (user × quiz): same stats scoped to a single quiz.
DROP FUNCTION IF EXISTS public.get_leaderboard_by_quiz();
CREATE OR REPLACE FUNCTION public.get_leaderboard_by_quiz()
RETURNS TABLE (
  user_id            uuid,
  username           text,
  quiz_id            text,
  sessions_played    bigint,
  questions_answered bigint,
  questions_correct  bigint,
  accuracy_pct       numeric,
  last_played        timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    u.id,
    COALESCE(
      NULLIF(u.raw_user_meta_data->>'display_name', ''),
      split_part(u.email, '@', 1)
    )::text AS username,
    s.quiz_id,
    COUNT(s.id)            AS sessions_played,
    SUM(s.total_questions) AS questions_answered,
    SUM(s.total_correct)   AS questions_correct,
    ROUND(
      SUM(s.total_correct)::numeric
      / NULLIF(SUM(s.total_questions), 0) * 100,
    1)                     AS accuracy_pct,
    MAX(s.ended_at)        AS last_played
  FROM auth.users u
  JOIN public.sessions s ON s.user_id = u.id
  GROUP BY u.id, u.email, u.raw_user_meta_data, s.quiz_id
  ORDER BY s.quiz_id, 7 DESC, 5 DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard_by_quiz() TO anon, authenticated;
