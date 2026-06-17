-- ============================================================
-- QuizSharp — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL editor)
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS + DO blocks
-- ============================================================

-- 1. users (mirrors auth.users; populated via trigger below)
CREATE TABLE IF NOT EXISTS public.users (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text NOT NULL,
  display_name text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Auto-populate users row on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;

-- 2. questions (content catalogue; populated separately)
CREATE TABLE IF NOT EXISTS public.questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body           text        NOT NULL,
  correct_answer text        NOT NULL,
  category       text        NOT NULL,
  difficulty     int         NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- 3. sessions (one row per completed quiz attempt)
CREATE TABLE IF NOT EXISTS public.sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES public.users(id) ON DELETE SET NULL,
  quiz_id             text        NOT NULL,   -- matches the slug used in the front-end
  started_at          timestamptz NOT NULL DEFAULT now(),
  ended_at            timestamptz,
  total_questions     int         NOT NULL,
  total_correct       int         NOT NULL,
  time_spent_seconds  int
);

CREATE INDEX IF NOT EXISTS sessions_user_quiz_idx ON public.sessions (user_id, quiz_id);

-- 4. responses (one row per question answered; optional for now)
CREATE TABLE IF NOT EXISTS public.responses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     uuid        NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id        uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  question_id    uuid        REFERENCES public.questions(id) ON DELETE SET NULL,
  is_correct     boolean     NOT NULL,
  answered_at    timestamptz NOT NULL DEFAULT now(),
  response_value text        NOT NULL,
  time_spent_ms  int
);

CREATE INDEX IF NOT EXISTS responses_session_idx ON public.responses (session_id);

-- 5. Accuracy view (aggregates responses for spaced-repetition UI later)
CREATE OR REPLACE VIEW public.question_accuracy_by_user AS
SELECT
  r.user_id,
  r.question_id,
  COUNT(*)                                           AS attempts,
  SUM(CASE WHEN r.is_correct THEN 1 ELSE 0 END)     AS correct,
  ROUND(
    SUM(CASE WHEN r.is_correct THEN 1 ELSE 0 END)::numeric
    / COUNT(*) * 100, 2
  )                                                  AS accuracy_pct,
  MAX(r.answered_at)                                 AS last_seen
FROM public.responses r
WHERE r.user_id IS NOT NULL
  AND r.question_id IS NOT NULL
GROUP BY r.user_id, r.question_id;

-- ============================================================
-- Row-level security
-- ============================================================

ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- users: only see your own row
DROP POLICY IF EXISTS "users: own row" ON public.users;
CREATE POLICY "users: own row" ON public.users
  FOR ALL USING (auth.uid() = id);

-- sessions: authenticated users see/insert their own; anon can insert (quiz_id only)
DROP POLICY IF EXISTS "sessions: own rows" ON public.sessions;
CREATE POLICY "sessions: own rows" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions: insert own" ON public.sessions;
CREATE POLICY "sessions: insert own" ON public.sessions
  FOR INSERT WITH CHECK (
    -- signed-in users must set their own user_id
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    -- anon users may insert a session without a user_id
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- responses: own rows only
DROP POLICY IF EXISTS "responses: own rows" ON public.responses;
CREATE POLICY "responses: own rows" ON public.responses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "responses: insert own" ON public.responses;
CREATE POLICY "responses: insert own" ON public.responses
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );
