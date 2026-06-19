-- ============================================================
-- Migration 009 — Restrict public.users SELECT policy
-- Migration 005 set the users SELECT policy to USING (true),
-- exposing the email column to any caller. Revert to own-row only.
-- SECURITY DEFINER leaderboard/team functions bypass RLS, so they
-- are unaffected by this change.
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

DROP POLICY IF EXISTS "users: own row" ON public.users;

CREATE POLICY "users: own row" ON public.users
  FOR SELECT USING (auth.uid() = id);
