/**
 * Quiz result persistence — Supabase-first, localStorage fallback.
 *
 * A "session" in Supabase matches what the app currently stores locally:
 *   { score, total, pct, timestamp }
 *
 * For unauthenticated users we still write to localStorage so the trend
 * chart keeps working.  When a user is signed in we write to Supabase
 * AND keep localStorage in sync so reads are fast / offline-tolerant.
 */

import { supabase } from "./supabaseClient";

// ── Local types ───────────────────────────────────────────────────────────────

export interface QuizResult {
  score: number;
  total: number;
  pct: number;
  timestamp: number;
}

export interface ResponseData {
  questionId: string;     // UUID for DB-backed questions, local id for static ones
  isCorrect: boolean;
  responseValue: string;  // the answer text the user selected
  timeSpentMs?: number;
}

export interface SaveResultOptions {
  quizId: string;
  result: QuizResult;
  /** Per-question response details for the responses table */
  responses?: ResponseData[];
  /** Time used in seconds */
  timeUsedSeconds?: number;
}

// ── localStorage helpers (unchanged from original) ───────────────────────────

const LS_PREFIX = "quizsharp-results-";

function lsLoad(quizId: string): QuizResult[] {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${quizId}`);
    return raw ? (JSON.parse(raw) as QuizResult[]) : [];
  } catch {
    return [];
  }
}

function lsSave(quizId: string, results: QuizResult[]): void {
  try {
    localStorage.setItem(`${LS_PREFIX}${quizId}`, JSON.stringify(results));
  } catch {
    // private browsing / storage full — silently ignore
  }
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

/**
 * Persist a completed quiz session to the `sessions` table.
 * Returns the new session id, or null on failure.
 */
async function insertSession(
  quizId: string,
  result: QuizResult,
  userId: string | null,
  timeUsedSeconds?: number
): Promise<string | null> {
  const safeTotal   = Math.max(1, Math.min(500, result.total));
  const safeScore   = Math.max(0, Math.min(safeTotal, result.score));
  const safeTimeSec = timeUsedSeconds != null ? Math.max(0, Math.min(86400, timeUsedSeconds)) : null;

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      quiz_id: quizId,
      started_at: new Date(result.timestamp - (safeTimeSec ?? 0) * 1000).toISOString(),
      ended_at: new Date(result.timestamp).toISOString(),
      total_questions: safeTotal,
      total_correct: safeScore,
      time_spent_seconds: safeTimeSec,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[quizResults] insertSession error:", error.message);
    return null;
  }
  return data?.id ?? null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Persist per-question responses into the `responses` table.
 * question_id is only written when the id is a real Supabase UUID;
 * static quiz question ids ("q1", "q2") are stored as null.
 */
async function insertResponses(
  sessionId: string,
  userId: string | null,
  responses: ResponseData[]
): Promise<void> {
  const rows = responses.map((r) => ({
    session_id:     sessionId,
    user_id:        userId,
    question_id:    UUID_RE.test(r.questionId) ? r.questionId : null,
    is_correct:     r.isCorrect,
    response_value: r.responseValue,
    time_spent_ms:  r.timeSpentMs ?? null,
  }));

  const { error } = await supabase.from("responses").insert(rows);
  if (error) {
    console.error("[quizResults] insertResponses error:", error.message);
  }
}

/**
 * Load all past sessions for this quiz from Supabase for the current user.
 * Converts them back into the QuizResult shape the UI expects.
 */
async function loadSessionsFromSupabase(
  quizId: string,
  userId: string
): Promise<QuizResult[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("total_correct, total_questions, ended_at")
    .eq("quiz_id", quizId)
    .eq("user_id", userId)
    .order("ended_at", { ascending: true });

  if (error || !data) {
    console.error("[quizResults] loadSessions error:", error?.message);
    return [];
  }

  return data.map((row) => {
    const pct = Math.round((row.total_correct / row.total_questions) * 100);
    return {
      score: row.total_correct,
      total: row.total_questions,
      pct,
      timestamp: new Date(row.ended_at ?? Date.now()).getTime(),
    };
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Save a quiz result.
 *
 * - Always appends to localStorage (fast, works offline).
 * - If the user is signed in, also writes to Supabase `sessions`.
 *
 * Returns the full updated history array (for the trend chart).
 */
export async function saveResult(opts: SaveResultOptions): Promise<QuizResult[]> {
  const { quizId, result, timeUsedSeconds, responses } = opts;

  // 1. Always update localStorage
  const existing = lsLoad(quizId);
  const updated = [...existing, result];
  lsSave(quizId, updated);

  // 2. Attempt Supabase write if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const sessionId = await insertSession(quizId, result, user.id, timeUsedSeconds);
    if (sessionId && responses?.length) {
      await insertResponses(sessionId, user.id, responses);
    }
    // Return the Supabase-authoritative history so the trend chart reflects
    // all sessions across every device, not just this browser's localStorage.
    const remote = await loadSessionsFromSupabase(quizId, user.id);
    if (remote.length > 0) {
      lsSave(quizId, remote); // keep localStorage in sync
      return remote;
    }
  }

  return updated;
}

/**
 * Load quiz history.
 *
 * - If user is signed in: fetch from Supabase (authoritative), then
 *   back-fill localStorage so subsequent renders are instant.
 * - Otherwise: return localStorage data.
 */
export async function loadResults(quizId: string): Promise<QuizResult[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const remote = await loadSessionsFromSupabase(quizId, user.id);
    if (remote.length > 0) {
      // Keep localStorage in sync for offline / fast reads
      lsSave(quizId, remote);
      return remote;
    }
  }

  // Fall back to localStorage (unauthenticated or no remote data yet)
  return lsLoad(quizId);
}
