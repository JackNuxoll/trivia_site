"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { saveResult, type QuizResult, type ResponseData } from "@/lib/quizResults";
import Nav from "@/components/Nav";

// ── Quiz metadata ─────────────────────────────────────────────────────────────
const QUIZ_META: Record<string, { title: string; category: string; difficulty: string }> = {
  "flags":              { title: "World Flags",             category: "Geography",    difficulty: "Medium" },
  "science-space":      { title: "Space Exploration",       category: "Science",      difficulty: "Hard"   },
  "history-ww2":        { title: "World War II",            category: "History",      difficulty: "Medium" },
  "geo-capitals":       { title: "World Capitals",          category: "Geography",    difficulty: "Easy"   },
  "pop-culture-90":     { title: "90s Nostalgia",           category: "Pop Culture",  difficulty: "Easy"   },
  "science-bio":        { title: "Human Biology",           category: "Science",      difficulty: "Hard"   },
  "history-ancient":    { title: "Ancient Civilizations",   category: "History",      difficulty: "Medium" },
  "sports-olympics":    { title: "Olympic History",         category: "Sports",       difficulty: "Medium" },
  "science-chem":       { title: "Chemistry Basics",        category: "Science",      difficulty: "Easy"   },
  "history-us":         { title: "U.S. Presidents",         category: "History",      difficulty: "Easy"   },
  "pop-culture-movies": { title: "Movie Trivia",            category: "Pop Culture",  difficulty: "Medium" },
  "sports-football":    { title: "Football Legends",        category: "Sports",       difficulty: "Hard"   },
  "geo-landmarks":      { title: "Famous Landmarks",        category: "Geography",    difficulty: "Easy"   },
  "science-physics":    { title: "Physics Fundamentals",    category: "Science",      difficulty: "Hard"   },
  "tech-internet":      { title: "History of the Internet", category: "Technology",   difficulty: "Medium" },
};

const DIFFICULTY_COLOR: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: "#DCFCE7", color: "#166534" },
  Medium: { bg: "#FEF9C3", color: "#854D0E" },
  Hard:   { bg: "#FEE2E2", color: "#991B1B" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getVerdict(pct: number): { label: string; color: string; emoji: string } {
  if (pct === 100) return { label: "Perfect score!",   color: "#7C3AED", emoji: "🏆" };
  if (pct >= 80)   return { label: "Excellent work!",  color: "#16A34A", emoji: "🎉" };
  if (pct >= 60)   return { label: "Good effort!",     color: "#D97706", emoji: "👍" };
  if (pct >= 40)   return { label: "Keep practicing!", color: "#EA580C", emoji: "📚" };
  return             { label: "Room to improve.",       color: "#DC2626", emoji: "💪" };
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, highlight }: { data: QuizResult[]; highlight: number }) {
  const W = 600, H = 120;
  const PAD = { top: 12, right: 16, bottom: 28, left: 36 };
  if (data.length < 2) return null;

  const pcts   = data.map((d) => d.pct);
  const minPct = Math.max(0,   Math.min(...pcts) - 10);
  const maxPct = Math.min(100, Math.max(...pcts) + 10);
  const range  = maxPct - minPct || 1;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;

  const xOf = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const yOf = (p: number) => PAD.top + innerH - ((p - minPct) / range) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xOf(i).toFixed(1)} ${yOf(d.pct).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xOf(data.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left} ${(PAD.top + innerH).toFixed(1)} Z`;
  const gridLines = [0, 50, 100].filter((v) => v >= minPct - 5 && v <= maxPct + 5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible", display: "block" }} aria-label="Score trend over time">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4F46E5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"    />
        </linearGradient>
      </defs>
      {gridLines.map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={yOf(v)} y2={yOf(v)} stroke="#E5E3DC" strokeWidth="1" strokeDasharray="4 3" />
          <text x={PAD.left - 6} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#9CA3AF" fontFamily="Inter, sans-serif">{v}%</text>
        </g>
      ))}
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const isHighlight = i === highlight;
        return (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(d.pct)} r={isHighlight ? 6 : 4} fill={isHighlight ? "#4F46E5" : "#fff"} stroke="#4F46E5" strokeWidth={isHighlight ? 2.5 : 2} />
            {isHighlight && (
              <text x={xOf(i)} y={yOf(d.pct) - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#4F46E5" fontFamily="Sora, sans-serif">{d.pct}%</text>
            )}
          </g>
        );
      })}
      {data.map((_, i) => (
        <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="Inter, sans-serif" fontWeight={i === highlight ? "700" : "400"}>
          {i === highlight ? "You" : `#${i + 1}`}
        </text>
      ))}
    </svg>
  );
}

// ── Animated count-up ─────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", duration = 900 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    function step(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return <>{value}{suffix}</>;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const quizId       = typeof params.id === "string" ? params.id : "science-space";

  const score    = parseInt(searchParams.get("score") ?? "0",  10);
  const total    = parseInt(searchParams.get("total") ?? "1",  10);
  const timeUsed = parseInt(searchParams.get("time")  ?? "0",  10);
  const pct      = Math.round((score / total) * 100);

  const meta    = QUIZ_META[quizId] ?? { title: "Quiz", category: "General", difficulty: "Medium" };
  const diff    = DIFFICULTY_COLOR[meta.difficulty];
  const verdict = getVerdict(pct);

  const [history,      setHistory]      = useState<QuizResult[]>([]);
  const [highlightIdx, setHighlightIdx] = useState(0);
  // Three states: "loading" | "ready" | "error"
  const [saveState,    setSaveState]    = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function persist() {
      try {
        let responses: ResponseData[] | undefined;
        try {
          const raw = sessionStorage.getItem(`quiz-responses-${quizId}`);
          if (raw) {
            responses = JSON.parse(raw) as ResponseData[];
            sessionStorage.removeItem(`quiz-responses-${quizId}`);
          }
        } catch { /* private browsing */ }

        const thisResult: QuizResult = { score, total, pct, timestamp: Date.now() };
        const all = await saveResult({
          quizId,
          result: thisResult,
          timeUsedSeconds: timeUsed,
          responses,
        });
        if (!cancelled) {
          setHistory(all);
          setHighlightIdx(all.length - 1);
          setSaveState("ready");
        }
      } catch (err) {
        console.error("[ResultsPage] failed to save result:", err);
        if (!cancelled) setSaveState("error");
      }
    }

    persist();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avgPct  = history.length ? Math.round(history.reduce((s, r) => s + r.pct, 0) / history.length) : pct;
  const bestPct = history.length ? Math.max(...history.map((r) => r.pct)) : pct;
  const showTrend = saveState === "ready" && history.length >= 2;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .r-shell { max-width:720px;margin:0 auto;padding:clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,2rem) 5rem;display:flex;flex-direction:column;gap:1.5rem; }

        @keyframes heroIn { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        .score-card { background:#fff;border-radius:20px;border:1px solid #E5E3DC;padding:2rem 2rem 1.75rem;animation:heroIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        .quiz-identity { display:flex;align-items:center;gap:10px;margin-bottom:1.75rem;padding-bottom:1.25rem;border-bottom:1px solid #F0EEE8; }
        .quiz-identity-title { font-family:'Sora',sans-serif;font-size:14px;font-weight:600;color:#1A1A2E; }
        .category-pill { font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#4F46E5;background:#E8E6FF;padding:3px 10px;border-radius:99px; }
        .difficulty-pill { font-size:11px;font-weight:600;padding:3px 10px;border-radius:99px; }

        .score-main { display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap; }
        .score-big { font-family:'Sora',sans-serif;font-size:clamp(3.5rem,10vw,5rem);font-weight:800;color:#1A1A2E;letter-spacing:-3px;line-height:1; }
        .score-big-denom { font-size:clamp(1.5rem,4vw,2rem);color:#9CA3AF;font-weight:600;letter-spacing:-1px; }
        .score-sub { font-size:14px;color:#6B7280;margin-top:6px;line-height:1.5; }
        .score-pct { font-family:'Sora',sans-serif;font-size:clamp(2.2rem,6vw,3rem);font-weight:800;letter-spacing:-2px;line-height:1; }
        .score-verdict { font-size:13px;color:#6B7280;margin-top:4px;font-weight:500; }
        .score-right { text-align:right; }

        .stat-tiles { display:grid;grid-template-columns:repeat(3,1fr);gap:10px; }
        @media(max-width:480px){.stat-tiles{grid-template-columns:repeat(2,1fr)}.stat-tile:last-child{grid-column:span 2}}
        .stat-tile { background:#F8F7F4;border-radius:12px;padding:1rem 1.25rem;border:1px solid #EFEDE7; }
        .stat-tile-val { font-family:'Sora',sans-serif;font-size:1.5rem;font-weight:700;color:#1A1A2E;letter-spacing:-0.5px;line-height:1; }
        .stat-tile-lbl { font-size:11px;color:#9CA3AF;margin-top:4px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em; }

        @keyframes trendIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        .trend-card { background:#fff;border-radius:20px;border:1px solid #E5E3DC;padding:1.75rem 2rem;animation:trendIn 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both; }
        .trend-header { display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap; }
        .trend-title { font-family:'Sora',sans-serif;font-size:1rem;font-weight:700;color:#1A1A2E; }
        .trend-meta-pills { display:flex;gap:8px;flex-wrap:wrap; }
        .trend-pill { display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:99px;background:#F8F7F4;color:#6B7280;border:1px solid #EFEDE7; }
        .trend-pill-dot { width:6px;height:6px;border-radius:50%; }
        .trend-empty { text-align:center;padding:2.5rem 1rem;color:#9CA3AF;font-size:14px;line-height:1.6; }
        .trend-empty strong { display:block;font-family:'Sora',sans-serif;font-size:15px;font-weight:600;color:#4B5563;margin-bottom:4px; }

        @keyframes shimmer { from{background-position:-400px 0}to{background-position:400px 0} }
        .shimmer-bar { height:120px;border-radius:10px;background:linear-gradient(90deg,#F8F7F4 25%,#EFEDE7 50%,#F8F7F4 75%);background-size:800px 100%;animation:shimmer 1.6s infinite; }

        .save-error { display:flex;align-items:center;gap:8px;padding:10px 14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;font-size:13px;color:#991B1B; }

        @keyframes actionsIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .actions-row { display:flex;gap:10px;animation:actionsIn 0.4s 0.25s cubic-bezier(0.22,1,0.36,1) both; }
        .action-btn { flex:1;padding:14px 20px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.15s;font-family:'Inter',sans-serif;text-align:center;text-decoration:none;display:inline-block; }
        .action-primary { background:#4F46E5;color:#fff;border:none; }
        .action-primary:hover { background:#4338CA;transform:translateY(-1px); }
        .action-secondary { background:transparent;color:#1A1A2E;border:1.5px solid #E5E3DC; }
        .action-secondary:hover { border-color:#4F46E5;color:#4F46E5;background:#F5F4FF; }

        @media(max-width:420px){.actions-row{flex-direction:column}.score-main{flex-direction:column;align-items:flex-start}.score-right{text-align:left}}
      `}</style>

      <Nav links={[
        { href: "/quizzes",     label: "Browse" },
        { href: "/leaderboard", label: "Leaderboard" },
      ]} />

      <div className="r-shell">

        {/* ── Score hero ── */}
        <div className="score-card">
          <div className="quiz-identity">
            <span className="quiz-identity-title">{meta.title}</span>
            <span className="category-pill">{meta.category}</span>
            <span className="difficulty-pill" style={{ background: diff.bg, color: diff.color }}>{meta.difficulty}</span>
          </div>

          <div className="score-main">
            <div className="score-left">
              <div className="score-big">
                <CountUp target={score} /><span className="score-big-denom">/{total}</span>
              </div>
              <div className="score-sub">{verdict.emoji} {verdict.label}</div>
            </div>
            <div className="score-right">
              <div className="score-pct" style={{ color: verdict.color }}>
                <CountUp target={pct} suffix="%" />
              </div>
              <div className="score-verdict">correct</div>
            </div>
          </div>

          <div className="stat-tiles">
            <div className="stat-tile">
              <div className="stat-tile-val" style={{ color: "#16A34A" }}>{score}</div>
              <div className="stat-tile-lbl">Correct</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-val" style={{ color: "#DC2626" }}>{total - score}</div>
              <div className="stat-tile-lbl">Incorrect</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-val">{formatTime(timeUsed)}</div>
              <div className="stat-tile-lbl">Time used</div>
            </div>
          </div>
        </div>

        {/* ── Save error banner ── */}
        {saveState === "error" && (
          <div className="save-error">
            ⚠️ Could not save your result to the cloud — it&apos;s stored locally for now.
          </div>
        )}

        {/* ── Trend card ── */}
        <div className="trend-card">
          <div className="trend-header">
            <div className="trend-title">Your score trend</div>
            {showTrend && (
              <div className="trend-meta-pills">
                <span className="trend-pill">
                  <span className="trend-pill-dot" style={{ background: "#4F46E5" }} />
                  Avg {avgPct}%
                </span>
                <span className="trend-pill">
                  <span className="trend-pill-dot" style={{ background: "#16A34A" }} />
                  Best {bestPct}%
                </span>
                <span className="trend-pill">{history.length} attempt{history.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {saveState === "loading" ? (
            <div className="shimmer-bar" />
          ) : showTrend ? (
            <div style={{ marginBottom: "0.5rem" }}>
              <Sparkline data={history} highlight={highlightIdx} />
            </div>
          ) : (
            <div className="trend-empty">
              <strong>No trend data yet</strong>
              Complete this quiz again to start tracking your progress over time.
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="actions-row">
          <button className="action-btn action-secondary" onClick={() => window.location.href = `/quiz/${quizId}`}>
            Try again
          </button>
          <Link href="/quizzes" className="action-btn action-primary">
            Browse quizzes
          </Link>
        </div>

      </div>
    </div>
  );
}
