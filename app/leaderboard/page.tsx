"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabaseClient";

// ── Types ────────────────────────────────────────────────────────────────────
interface OverallEntry {
  user_id: string;
  username: string;
  team_id: string | null;
  team_name: string | null;
  sessions_played: number;
  questions_answered: number;
  questions_correct: number;
  accuracy_pct: number;
}

interface QuizEntry extends OverallEntry {
  quiz_id: string;
  last_played: string;
}

interface TeamEntry {
  team_id: string;
  team_name: string;
  member_count: number;
  sessions_played: number;
  questions_answered: number;
  questions_correct: number;
  accuracy_pct: number;
}

// ── Quiz ID → display name ────────────────────────────────────────────────────
const QUIZ_NAMES: Record<string, string> = {
  "flags":               "World Flags",
  "history-ww2":         "World War II",
  "science-space":       "Space Exploration",
  "geo-capitals":        "World Capitals",
  "pop-culture-90":      "90s Nostalgia",
  "science-bio":         "Human Biology",
  "history-ancient":     "Ancient Civilizations",
  "sports-olympics":     "Olympic History",
  "science-chem":        "Chemistry Basics",
  "history-us":          "U.S. Presidents",
  "pop-culture-movies":  "Movie Trivia",
  "sports-football":     "Football Legends",
  "geo-landmarks":       "Famous Landmarks",
  "science-physics":     "Physics Fundamentals",
  "tech-internet":       "History of the Internet",
};

function quizName(id: string) {
  return QUIZ_NAMES[id] ?? id;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// ── Accuracy bar ─────────────────────────────────────────────────────────────
function AccBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "#16A34A" : pct >= 60 ? "#D97706" : "#DC2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#EFEDE7", borderRadius: 99, overflow: "hidden", minWidth: 60 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontWeight: 700, color, fontSize: 13, minWidth: 38, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

// ── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[40, 120, 80, 80, 140, 70].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <div style={{ height: 14, width: w, borderRadius: 6, background: "linear-gradient(90deg,#F0EEE8 25%,#E5E3DC 50%,#F0EEE8 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s infinite" }} />
        </td>
      ))}
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [tab,           setTab]           = useState<"overall" | "by-quiz" | "by-team">("overall");
  const [overall,       setOverall]       = useState<OverallEntry[]>([]);
  const [quizData,      setQuizData]      = useState<QuizEntry[]>([]);
  const [teamData,      setTeamData]      = useState<TeamEntry[]>([]);
  const [selectedQuiz,  setSelectedQuiz]  = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingOverall, setLoadingOverall] = useState(true);
  const [loadingQuiz,    setLoadingQuiz]    = useState(false);
  const [loadingTeam,    setLoadingTeam]    = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  // ── Fetch overall on mount ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      const { data, error } = await supabase.rpc("get_leaderboard_overall");
      if (error) { setError(error.message); setLoadingOverall(false); return; }
      setOverall((data as OverallEntry[]) ?? []);
      setLoadingOverall(false);
    }
    load();
  }, []);

  // ── Fetch quiz breakdown when tab switches ──────────────────────────────────
  useEffect(() => {
    if (tab !== "by-quiz" || quizData.length > 0) return;
    setLoadingQuiz(true);
    supabase.rpc("get_leaderboard_by_quiz").then(({ data, error }) => {
      if (!error && data) {
        setQuizData(data as QuizEntry[]);
        const first = (data as QuizEntry[])[0]?.quiz_id ?? null;
        setSelectedQuiz((prev) => prev ?? first);
      }
      setLoadingQuiz(false);
    });
  }, [tab, quizData.length]);

  // ── Fetch team leaderboard when tab switches ────────────────────────────────
  useEffect(() => {
    if (tab !== "by-team" || teamData.length > 0) return;
    setLoadingTeam(true);
    supabase.rpc("get_team_leaderboard").then(({ data, error }) => {
      if (!error && data) setTeamData(data as TeamEntry[]);
      setLoadingTeam(false);
    });
  }, [tab, teamData.length]);

  // ── Derived data ────────────────────────────────────────────────────────────
  const availableQuizzes = useMemo(() => {
    const seen = new Set<string>();
    return quizData.filter((r) => {
      if (seen.has(r.quiz_id)) return false;
      seen.add(r.quiz_id);
      return true;
    }).map((r) => r.quiz_id);
  }, [quizData]);

  const filteredQuiz = useMemo(() =>
    quizData.filter((r) => r.quiz_id === selectedQuiz),
  [quizData, selectedQuiz]);

  const totalQuestionsAnswered = overall.reduce((s, r) => s + r.questions_answered, 0);
  const totalCorrect           = overall.reduce((s, r) => s + r.questions_correct, 0);
  const platformAccuracy       = totalQuestionsAnswered > 0
    ? Math.round(totalCorrect / totalQuestionsAnswered * 100) : 0;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes shimmer { from{background-position:-400px 0} to{background-position:400px 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .lb-shell {
          max-width: 1000px; margin: 0 auto;
          padding: clamp(2rem,5vw,3rem) clamp(1.5rem,5vw,2rem) 5rem;
        }

        /* ── Header ── */
        .lb-header { margin-bottom: 2rem; }
        .lb-title { font-family:'Sora',sans-serif; font-size:clamp(1.8rem,4vw,2.4rem); font-weight:700; color:#1A1A2E; letter-spacing:-1px; margin-bottom:0.4rem; }
        .lb-subtitle { font-size:15px; color:#6B7280; }

        /* ── Summary pills ── */
        .lb-summary { display:flex; gap:12px; margin-bottom:2rem; flex-wrap:wrap; }
        .lb-stat { background:#fff; border:1px solid #E5E3DC; border-radius:12px; padding:0.85rem 1.25rem; display:flex; flex-direction:column; gap:2px; }
        .lb-stat-val { font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:700; color:#1A1A2E; letter-spacing:-0.5px; }
        .lb-stat-lbl { font-size:11px; color:#9CA3AF; font-weight:500; text-transform:uppercase; letter-spacing:0.05em; }

        /* ── Tabs ── */
        .lb-tabs { display:flex; gap:4px; background:#F0EEE8; border-radius:10px; padding:4px; margin-bottom:1.75rem; border:1px solid #E5E3DC; width:fit-content; }
        .lb-tab { padding:8px 20px; border-radius:7px; font-size:14px; font-weight:600; cursor:pointer; border:none; background:transparent; color:#6B7280; transition:all 0.15s; font-family:'Inter',sans-serif; }
        .lb-tab.active { background:#fff; color:#1A1A2E; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
        .lb-tab:hover:not(.active) { color:#4F46E5; }

        /* ── Quiz selector ── */
        .quiz-selector { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:1.5rem; }
        .quiz-pill { padding:7px 14px; border-radius:99px; font-size:13px; font-weight:600; border:1.5px solid #E5E3DC; background:#fff; color:#4B5563; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s; white-space:nowrap; }
        .quiz-pill:hover { border-color:#4F46E5; color:#4F46E5; }
        .quiz-pill.active { background:#4F46E5; border-color:#4F46E5; color:#fff; }

        /* ── Table ── */
        .lb-table-wrap { background:#fff; border-radius:16px; border:1px solid #E5E3DC; overflow:hidden; animation:fadeIn 0.3s ease; }
        .lb-table { width:100%; border-collapse:collapse; }
        .lb-table th { padding:12px 16px; text-align:left; font-size:11px; font-weight:600; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.06em; background:#F8F7F4; border-bottom:1px solid #E5E3DC; white-space:nowrap; }
        .lb-table th.right { text-align:right; }
        .lb-table td { padding:14px 16px; border-bottom:1px solid #F0EEE8; font-size:14px; color:#374151; vertical-align:middle; }
        .lb-table tr:last-child td { border-bottom:none; }
        .lb-table tbody tr { transition:background 0.1s; }
        .lb-table tbody tr:hover { background:#FAFAF9; }
        .lb-table tbody tr.me { background:#F5F4FF; }
        .lb-table tbody tr.me:hover { background:#EEEEFF; }

        /* ── Rank cell ── */
        .rank-cell { display:flex; align-items:center; gap:8px; }
        .rank-num { font-family:'Sora',sans-serif; font-weight:700; color:#9CA3AF; font-size:14px; min-width:20px; }
        .rank-medal { font-size:18px; line-height:1; }

        /* ── User cell ── */
        .user-cell { display:flex; align-items:center; gap:10px; }
        .user-avatar { width:32px; height:32px; border-radius:50%; background:#E8E6FF; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#4F46E5; flex-shrink:0; font-family:'Sora',sans-serif; }
        .user-name { font-weight:600; color:#1A1A2E; }
        .you-badge { font-size:10px; font-weight:700; background:#4F46E5; color:#fff; padding:1px 6px; border-radius:99px; letter-spacing:0.04em; }

        /* ── Team link ── */
        .team-link { font-size:13px; color:#4F46E5; font-weight:500; text-decoration:none; }
        .team-link:hover { text-decoration:underline; }
        .no-team { font-size:13px; color:#D1D5DB; }

        /* ── Team cell (by-team tab) ── */
        .team-cell { display:flex; align-items:center; gap:10px; }
        .team-avatar { width:32px; height:32px; border-radius:8px; background:#E8E6FF; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#4F46E5; flex-shrink:0; font-family:'Sora',sans-serif; }
        .team-name-link { font-weight:600; color:#1A1A2E; text-decoration:none; }
        .team-name-link:hover { color:#4F46E5; text-decoration:underline; }

        /* ── Number cells ── */
        .num-cell { font-family:'Sora',sans-serif; font-weight:600; color:#1A1A2E; text-align:right; }
        .sub-num { font-size:11px; color:#9CA3AF; font-weight:400; }

        /* ── Empty state ── */
        .lb-empty { text-align:center; padding:4rem 2rem; }
        .lb-empty-title { font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:600; color:#1A1A2E; margin-bottom:0.5rem; }
        .lb-empty-body { font-size:14px; color:#9CA3AF; }

        /* ── Error ── */
        .lb-error { background:#FEF2F2; border:1px solid #FECACA; border-radius:12px; padding:1.25rem 1.5rem; color:#991B1B; font-size:14px; }

        @media (max-width: 600px) {
          .lb-table th.hide-sm, .lb-table td.hide-sm { display:none; }
        }
      `}</style>

      <Nav links={[
        { href: "/quizzes",     label: "Browse" },
        { href: "/leaderboard", label: "Leaderboard" },
      ]} />

      <div className="lb-shell">

        {/* ── Header ── */}
        <div className="lb-header">
          <h1 className="lb-title">Leaderboard</h1>
          <p className="lb-subtitle">See how everyone stacks up — overall and by quiz.</p>
        </div>

        {/* ── Summary stats ── */}
        {!loadingOverall && !error && (
          <div className="lb-summary">
            <div className="lb-stat">
              <span className="lb-stat-val">{overall.length}</span>
              <span className="lb-stat-lbl">Players</span>
            </div>
            <div className="lb-stat">
              <span className="lb-stat-val">{totalQuestionsAnswered.toLocaleString()}</span>
              <span className="lb-stat-lbl">Questions answered</span>
            </div>
            <div className="lb-stat">
              <span className="lb-stat-val">{platformAccuracy}%</span>
              <span className="lb-stat-lbl">Overall accuracy</span>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="lb-tabs">
          <button className={`lb-tab${tab === "overall"  ? " active" : ""}`} onClick={() => setTab("overall")}>Overall</button>
          <button className={`lb-tab${tab === "by-quiz"  ? " active" : ""}`} onClick={() => setTab("by-quiz")}>By Quiz</button>
          <button className={`lb-tab${tab === "by-team"  ? " active" : ""}`} onClick={() => setTab("by-team")}>By Team</button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="lb-error">
            ⚠️ Could not load leaderboard: {error}. Make sure you have run migration 002_leaderboard_functions.sql in your Supabase SQL editor.
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            OVERALL TAB
        ══════════════════════════════════════════════════════════════════════ */}
        {tab === "overall" && !error && (
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Rank</th>
                  <th>Player</th>
                  <th className="hide-sm">Team</th>
                  <th className="right hide-sm">Quizzes</th>
                  <th className="right hide-sm">Answered</th>
                  <th className="right hide-sm">Correct</th>
                  <th style={{ minWidth: 160 }}>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {loadingOverall ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : overall.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="lb-empty">
                        <div className="lb-empty-title">No data yet</div>
                        <div className="lb-empty-body">Complete a quiz to appear here.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  overall.map((row, i) => {
                    const isMe = row.user_id === currentUserId;
                    const m    = medal(i + 1);
                    return (
                      <tr key={row.user_id} className={isMe ? "me" : ""}>
                        <td>
                          <div className="rank-cell">
                            {m
                              ? <span className="rank-medal">{m}</span>
                              : <span className="rank-num">#{i + 1}</span>
                            }
                          </div>
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{row.username[0]?.toUpperCase()}</div>
                            <span className="user-name">{row.username}</span>
                            {isMe && <span className="you-badge">YOU</span>}
                          </div>
                        </td>
                        <td className="hide-sm">
                          {row.team_name && row.team_id
                            ? <Link href={`/teams/${row.team_id}`} className="team-link">{row.team_name}</Link>
                            : <span className="no-team">—</span>
                          }
                        </td>
                        <td className="num-cell hide-sm">{row.sessions_played}</td>
                        <td className="num-cell hide-sm">{row.questions_answered.toLocaleString()}</td>
                        <td className="num-cell hide-sm">
                          {row.questions_correct.toLocaleString()}
                          <span className="sub-num"> / {row.questions_answered.toLocaleString()}</span>
                        </td>
                        <td><AccBar pct={Number(row.accuracy_pct)} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            BY QUIZ TAB
        ══════════════════════════════════════════════════════════════════════ */}
        {tab === "by-quiz" && !error && (
          <>
            {/* Quiz selector */}
            {loadingQuiz ? (
              <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {[100, 80, 120, 90, 110].map((w, i) => (
                  <div key={i} style={{ height: 36, width: w, borderRadius: 99, background: "linear-gradient(90deg,#F0EEE8 25%,#E5E3DC 50%,#F0EEE8 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s infinite" }} />
                ))}
              </div>
            ) : (
              <div className="quiz-selector">
                {availableQuizzes.length === 0 ? (
                  <p style={{ fontSize: 14, color: "#9CA3AF" }}>No quiz data yet — complete a quiz to see per-quiz stats.</p>
                ) : (
                  availableQuizzes.map((qid) => (
                    <button
                      key={qid}
                      className={`quiz-pill${selectedQuiz === qid ? " active" : ""}`}
                      onClick={() => setSelectedQuiz(qid)}
                    >
                      {quizName(qid)}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Per-quiz table */}
            {selectedQuiz && (
              <div className="lb-table-wrap">
                <table className="lb-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Rank</th>
                      <th>Player</th>
                      <th className="hide-sm">Team</th>
                      <th className="right hide-sm">Plays</th>
                      <th className="right hide-sm">Answered</th>
                      <th className="right hide-sm">Correct</th>
                      <th style={{ minWidth: 160 }}>Accuracy</th>
                      <th className="right hide-sm">Last Played</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingQuiz ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : filteredQuiz.length === 0 ? (
                      <tr>
                        <td colSpan={8}>
                          <div className="lb-empty">
                            <div className="lb-empty-title">No one has played {quizName(selectedQuiz)} yet</div>
                            <div className="lb-empty-body">Be the first to try it.</div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredQuiz.map((row, i) => {
                        const isMe = row.user_id === currentUserId;
                        const m    = medal(i + 1);
                        return (
                          <tr key={row.user_id} className={isMe ? "me" : ""}>
                            <td>
                              <div className="rank-cell">
                                {m
                                  ? <span className="rank-medal">{m}</span>
                                  : <span className="rank-num">#{i + 1}</span>
                                }
                              </div>
                            </td>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar">{row.username[0]?.toUpperCase()}</div>
                                <span className="user-name">{row.username}</span>
                                {isMe && <span className="you-badge">YOU</span>}
                              </div>
                            </td>
                            <td className="hide-sm">
                              {row.team_name && row.team_id
                                ? <Link href={`/teams/${row.team_id}`} className="team-link">{row.team_name}</Link>
                                : <span className="no-team">—</span>
                              }
                            </td>
                            <td className="num-cell hide-sm">{row.sessions_played}</td>
                            <td className="num-cell hide-sm">{row.questions_answered.toLocaleString()}</td>
                            <td className="num-cell hide-sm">
                              {row.questions_correct.toLocaleString()}
                              <span className="sub-num"> / {row.questions_answered.toLocaleString()}</span>
                            </td>
                            <td><AccBar pct={Number(row.accuracy_pct)} /></td>
                            <td className="hide-sm" style={{ fontSize: 13, color: "#9CA3AF", textAlign: "right" }}>
                              {row.last_played ? formatDate(row.last_played) : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            BY TEAM TAB
        ══════════════════════════════════════════════════════════════════════ */}
        {tab === "by-team" && !error && (
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Rank</th>
                  <th>Team</th>
                  <th className="right hide-sm">Members</th>
                  <th className="right hide-sm">Answered</th>
                  <th className="right hide-sm">Correct</th>
                  <th style={{ minWidth: 160 }}>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {loadingTeam ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : teamData.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="lb-empty">
                        <div className="lb-empty-title">No teams yet</div>
                        <div className="lb-empty-body">Join or create a team to appear here.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  teamData.map((row, i) => {
                    const m = medal(i + 1);
                    return (
                      <tr key={row.team_id}>
                        <td>
                          <div className="rank-cell">
                            {m
                              ? <span className="rank-medal">{m}</span>
                              : <span className="rank-num">#{i + 1}</span>
                            }
                          </div>
                        </td>
                        <td>
                          <div className="team-cell">
                            <div className="team-avatar">{row.team_name[0]?.toUpperCase()}</div>
                            <Link href={`/teams/${row.team_id}`} className="team-name-link">{row.team_name}</Link>
                          </div>
                        </td>
                        <td className="num-cell hide-sm">{row.member_count}</td>
                        <td className="num-cell hide-sm">{row.questions_answered.toLocaleString()}</td>
                        <td className="num-cell hide-sm">
                          {row.questions_correct.toLocaleString()}
                          <span className="sub-num"> / {row.questions_answered.toLocaleString()}</span>
                        </td>
                        <td><AccBar pct={Number(row.accuracy_pct)} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
