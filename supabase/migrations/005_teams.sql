-- Migration 005: Add team support
--
-- This migration introduces a `teams` table and wires it into the existing
-- user and leaderboard infrastructure. Specifically it:
--   1. Creates the `public.teams` table with RLS policies.
--   2. Adds a `team_id` foreign-key column to `public.users`.
--   3. Replaces the existing leaderboard functions so they expose team info.
--   4. Adds two new functions: `get_team_leaderboard()` and
--      `get_team_members(p_team_id uuid)`.
--   5. Broadens the `public.users` RLS policies so all authenticated/anon
--      callers can read user rows (needed for leaderboard display).
--
-- Safe to run in the Supabase SQL editor (idempotent via IF NOT EXISTS /
-- DROP IF EXISTS guards).

-- ============================================================
-- 1. Teams table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  created_by  uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT teams_name_unique UNIQUE (name)
);

-- ============================================================
-- 2. Add team_id to users
-- ============================================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL;

-- ============================================================
-- 3. RLS for teams table
-- ============================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teams: public read" ON public.teams;
CREATE POLICY "teams: public read" ON public.teams
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "teams: insert authenticated" ON public.teams;
CREATE POLICY "teams: insert authenticated" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

DROP POLICY IF EXISTS "teams: update by creator" ON public.teams;
CREATE POLICY "teams: update by creator" ON public.teams
  FOR UPDATE USING (auth.uid() = created_by);

-- ============================================================
-- 4. Broaden public.users RLS for leaderboard purposes
-- ============================================================

DROP POLICY IF EXISTS "users: own row" ON public.users;
CREATE POLICY "users: own row" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "users: update own" ON public.users;
CREATE POLICY "users: update own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "users: insert own" ON public.users;
CREATE POLICY "users: insert own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- 5. Drop and recreate leaderboard functions with team info
-- ============================================================

-- 5a. get_leaderboard_overall()

DROP FUNCTION IF EXISTS public.get_leaderboard_overall();
CREATE OR REPLACE FUNCTION public.get_leaderboard_overall()
RETURNS TABLE (
  user_id             uuid,
  username            text,
  team_id             uuid,
  team_name           text,
  sessions_played     bigint,
  questions_answered  bigint,
  questions_correct   bigint,
  accuracy_pct        numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    u.id,
    COALESCE(
      NULLIF(pu.display_name, ''),
      NULLIF(u.raw_user_meta_data->>'display_name', ''),
      split_part(u.email, '@', 1)
    )::text AS username,
    t.id   AS team_id,
    t.name AS team_name,
    COUNT(s.id)            AS sessions_played,
    SUM(s.total_questions) AS questions_answered,
    SUM(s.total_correct)   AS questions_correct,
    ROUND(
      SUM(s.total_correct)::numeric
      / NULLIF(SUM(s.total_questions), 0) * 100,
    1)                     AS accuracy_pct
  FROM auth.users u
  JOIN public.sessions s ON s.user_id = u.id
  LEFT JOIN public.users pu ON pu.id = u.id
  LEFT JOIN public.teams t ON t.id = pu.team_id
  GROUP BY u.id, u.email, u.raw_user_meta_data, pu.display_name, t.id, t.name
  ORDER BY 8 DESC, 6 DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard_overall() TO anon, authenticated;

-- 5b. get_leaderboard_by_quiz()

DROP FUNCTION IF EXISTS public.get_leaderboard_by_quiz();
CREATE OR REPLACE FUNCTION public.get_leaderboard_by_quiz()
RETURNS TABLE (
  user_id             uuid,
  username            text,
  team_id             uuid,
  team_name           text,
  quiz_id             text,
  sessions_played     bigint,
  questions_answered  bigint,
  questions_correct   bigint,
  accuracy_pct        numeric,
  last_played         timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    u.id,
    COALESCE(
      NULLIF(pu.display_name, ''),
      NULLIF(u.raw_user_meta_data->>'display_name', ''),
      split_part(u.email, '@', 1)
    )::text AS username,
    t.id   AS team_id,
    t.name AS team_name,
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
  LEFT JOIN public.users pu ON pu.id = u.id
  LEFT JOIN public.teams t ON t.id = pu.team_id
  GROUP BY u.id, u.email, u.raw_user_meta_data, pu.display_name, t.id, t.name, s.quiz_id
  ORDER BY s.quiz_id, 9 DESC, 7 DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard_by_quiz() TO anon, authenticated;

-- 5c. get_team_leaderboard()

CREATE OR REPLACE FUNCTION public.get_team_leaderboard()
RETURNS TABLE (
  team_id             uuid,
  team_name           text,
  member_count        bigint,
  sessions_played     bigint,
  questions_answered  bigint,
  questions_correct   bigint,
  accuracy_pct        numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    t.id             AS team_id,
    t.name           AS team_name,
    COUNT(DISTINCT pu.id)  AS member_count,
    COUNT(s.id)            AS sessions_played,
    SUM(s.total_questions) AS questions_answered,
    SUM(s.total_correct)   AS questions_correct,
    ROUND(
      SUM(s.total_correct)::numeric
      / NULLIF(SUM(s.total_questions), 0) * 100,
    1)                     AS accuracy_pct
  FROM public.teams t
  JOIN public.users pu ON pu.team_id = t.id
  LEFT JOIN public.sessions s ON s.user_id = pu.id
  GROUP BY t.id, t.name
  ORDER BY 7 DESC NULLS LAST, 5 DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_leaderboard() TO anon, authenticated;

-- 5d. get_team_members(p_team_id uuid)

CREATE OR REPLACE FUNCTION public.get_team_members(p_team_id uuid)
RETURNS TABLE (
  user_id             uuid,
  username            text,
  sessions_played     bigint,
  questions_answered  bigint,
  questions_correct   bigint,
  accuracy_pct        numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT
    u.id,
    COALESCE(
      NULLIF(pu.display_name, ''),
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
  FROM public.users pu
  JOIN auth.users u ON u.id = pu.id
  LEFT JOIN public.sessions s ON s.user_id = pu.id
  WHERE pu.team_id = p_team_id
  GROUP BY u.id, u.email, u.raw_user_meta_data, pu.display_name
  ORDER BY 6 DESC NULLS LAST, 4 DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_members(uuid) TO anon, authenticated;
