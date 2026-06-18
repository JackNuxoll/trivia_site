"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabaseClient";

// ── Types ────────────────────────────────────────────────────────────────────
interface TeamDetails {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface TeamMember {
  user_id: string;
  username: string;
  sessions_played: number;
  questions_answered: number;
  questions_correct: number;
  accuracy_pct: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
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
export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [team,    setTeam]    = useState<TeamDetails | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);

      const [teamRes, membersRes] = await Promise.all([
        supabase.from("teams").select("id, name, description, created_at").eq("id", id).single(),
        supabase.rpc("get_team_members", { p_team_id: id }),
      ]);

      if (teamRes.error || !teamRes.data) {
        setError(teamRes.error?.message ?? "Team not found.");
        setLoading(false);
        return;
      }

      setTeam(teamRes.data as TeamDetails);
      setMembers((membersRes.data as TeamMember[]) ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalAnswered = members.reduce((s, m) => s + m.questions_answered, 0);
  const totalCorrect  = members.reduce((s, m) => s + m.questions_correct, 0);
  const teamAccuracy  = totalAnswered > 0
    ? Math.round(totalCorrect / totalAnswered * 100) : 0;

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

        /* ── Back link ── */
        .back-link { display:inline-flex; align-items:center; gap:6px; font-size:14px; color:#4F46E5; text-decoration:none; margin-bottom:1.5rem; font-weight:500; }
        .back-link:hover { text-decoration:underline; }

        /* ── Header ── */
        .lb-header { margin-bottom:2rem; }
        .team-header-row { display:flex; align-items:center; gap:16px; margin-bottom:0.5rem; }
        .team-big-avatar { width:52px; height:52px; border-radius:14px; background:#E8E6FF; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; color:#4F46E5; flex-shrink:0; font-family:'Sora',sans-serif; }
        .lb-title { font-family:'Sora',sans-serif; font-size:clamp(1.8rem,4vw,2.4rem); font-weight:700; color:#1A1A2E; letter-spacing:-1px; }
        .lb-subtitle { font-size:15px; color:#6B7280; margin-top:0.3rem; }
        .member-count-badge { display:inline-flex; align-items:center; font-size:12px; font-weight:600; color:#4F46E5; background:#EEF2FF; border:1px solid #C7D2FE; border-radius:99px; padding:3px 10px; margin-left:4px; }

        /* ── Summary pills ── */
        .lb-summary { display:flex; gap:12px; margin-bottom:2rem; flex-wrap:wrap; }
        .lb-stat { background:#fff; border:1px solid #E5E3DC; border-radius:12px; padding:0.85rem 1.25rem; display:flex; flex-direction:column; gap:2px; }
        .lb-stat-val { font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:700; color:#1A1A2E; letter-spacing:-0.5px; }
        .lb-stat-lbl { font-size:11px; color:#9CA3AF; font-weight:500; text-transform:uppercase; letter-spacing:0.05em; }

        /* ── Table ── */
        .lb-table-wrap { background:#fff; border-radius:16px; border:1px solid #E5E3DC; overflow:hidden; animation:fadeIn 0.3s ease; }
        .lb-table { width:100%; border-collapse:collapse; }
        .lb-table th { padding:12px 16px; text-align:left; font-size:11px; font-weight:600; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.06em; background:#F8F7F4; border-bottom:1px solid #E5E3DC; white-space:nowrap; }
        .lb-table th.right { text-align:right; }
        .lb-table td { padding:14px 16px; border-bottom:1px solid #F0EEE8; font-size:14px; color:#374151; vertical-align:middle; }
        .lb-table tr:last-child td { border-bottom:none; }
        .lb-table tbody tr { transition:background 0.1s; }
        .lb-table tbody tr:hover { background:#FAFAF9; }

        /* ── Rank cell ── */
        .rank-cell { display:flex; align-items:center; gap:8px; }
        .rank-num { font-family:'Sora',sans-serif; font-weight:700; color:#9CA3AF; font-size:14px; min-width:20px; }
        .rank-medal { font-size:18px; line-height:1; }

        /* ── User cell ── */
        .user-cell { display:flex; align-items:center; gap:10px; }
        .user-avatar { width:32px; height:32px; border-radius:50%; background:#E8E6FF; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#4F46E5; flex-shrink:0; font-family:'Sora',sans-serif; }
        .user-name { font-weight:600; color:#1A1A2E; }

        /* ── Number cells ── */
        .num-cell { font-family:'Sora',sans-serif; font-weight:600; color:#1A1A2E; text-align:right; }
        .sub-num { font-size:11px; color:#9CA3AF; font-weight:400; }

        /* ── Empty state ── */
        .lb-empty { text-align:center; padding:4rem 2rem; }
        .lb-empty-title { font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:600; color:#1A1A2E; margin-bottom:0.5rem; }
        .lb-empty-body { font-size:14px; color:#9CA3AF; }

        /* ── Error ── */
        .lb-error { background:#FEF2F2; border:1px solid #FECACA; border-radius:12px; padding:1.25rem 1.5rem; color:#991B1B; font-size:14px; }

        /* ── Skeleton header ── */
        .skel-block { border-radius:8px; background:linear-gradient(90deg,#F0EEE8 25%,#E5E3DC 50%,#F0EEE8 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }

        @media (max-width: 600px) {
          .lb-table th.hide-sm, .lb-table td.hide-sm { display:none; }
        }
      `}</style>

      <Nav links={[
        { href: "/quizzes",     label: "Browse" },
        { href: "/leaderboard", label: "Leaderboard" },
      ]} />

      <div className="lb-shell">

        <Link href="/leaderboard" className="back-link">← Leaderboard</Link>

        {/* ── Error ── */}
        {error && (
          <div className="lb-error">
            ⚠️ {error}
          </div>
        )}

        {!error && (
          <>
            {/* ── Team header ── */}
            <div className="lb-header">
              {loading ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "0.5rem" }}>
                    <div className="skel-block" style={{ width: 52, height: 52, borderRadius: 14 }} />
                    <div className="skel-block" style={{ width: 220, height: 32 }} />
                  </div>
                  <div className="skel-block" style={{ width: 300, height: 16, marginTop: 8 }} />
                </>
              ) : team && (
                <>
                  <div className="team-header-row">
                    <div className="team-big-avatar">{team.name[0]?.toUpperCase()}</div>
                    <h1 className="lb-title">
                      {team.name}
                      <span className="member-count-badge">{members.length} {members.length === 1 ? "member" : "members"}</span>
                    </h1>
                  </div>
                  {team.description && (
                    <p className="lb-subtitle">{team.description}</p>
                  )}
                </>
              )}
            </div>

            {/* ── Summary stats ── */}
            {!loading && (
              <div className="lb-summary">
                <div className="lb-stat">
                  <span className="lb-stat-val">{members.length}</span>
                  <span className="lb-stat-lbl">Members</span>
                </div>
                <div className="lb-stat">
                  <span className="lb-stat-val">{totalAnswered.toLocaleString()}</span>
                  <span className="lb-stat-lbl">Questions answered</span>
                </div>
                <div className="lb-stat">
                  <span className="lb-stat-val">{teamAccuracy}%</span>
                  <span className="lb-stat-lbl">Team accuracy</span>
                </div>
              </div>
            )}

            {/* ── Members table ── */}
            <div className="lb-table-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Rank</th>
                    <th>Player</th>
                    <th className="right hide-sm">Quizzes</th>
                    <th className="right hide-sm">Answered</th>
                    <th className="right hide-sm">Correct</th>
                    <th style={{ minWidth: 160 }}>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="lb-empty">
                          <div className="lb-empty-title">No members yet</div>
                          <div className="lb-empty-body">No one has joined this team yet.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    members.map((row, i) => {
                      const m = medal(i + 1);
                      return (
                        <tr key={row.user_id}>
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
                            </div>
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
          </>
        )}

      </div>
    </div>
  );
}
