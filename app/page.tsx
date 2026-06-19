"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const QUIZ_NAMES: Record<string, string> = {
  "flags":              "World Flags",
  "us-state-capitals":  "US State Capitals",
  "history-ww2":        "World War II",
  "science-space":      "Space Exploration",
  "nfl-divisions":      "NFL Divisions",
  "mlb-divisions":      "MLB Divisions",
  "nba-divisions":      "NBA Divisions",
  "ncaa-conferences":   "NCAA Conferences",
  "wwii-battles":       "WWII: Key Battles",
  "wwii-leaders":       "WWII: Leaders & Figures",
  "wwii-timeline":      "WWII: Timeline & Milestones",
  "movies-awards":      "Academy Awards",
  "movies-quotes":      "Famous Movie Quotes",
  "movies-villains":    "Movie Villains",
  "geo-capitals":       "World Capitals",
  "pop-culture-90":     "90s Nostalgia",
  "science-bio":        "Human Biology",
  "history-ancient":    "Ancient Civilizations",
  "sports-olympics":    "Olympic History",
  "science-chem":       "Chemistry Basics",
  "history-us":         "U.S. Presidents",
  "pop-culture-movies": "Movie Trivia",
  "sports-football":    "Football Legends",
  "geo-landmarks":      "Famous Landmarks",
  "science-physics":    "Physics Fundamentals",
  "tech-internet":      "History of the Internet",
};

interface TopQuiz { quiz_id: string; total_plays: number; }
interface LiveStats { questions: number; categories: number; plays: number; }

// Animated hero question preview ──────────────────────────────────────────────
const SAMPLE_QUESTION = {
  text: "Which planet in our solar system has the most moons?",
  answers: ["Mars", "Jupiter", "Saturn", "Uranus"],
  correct: 2, // Saturn
};

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const [selected,     setSelected]     = useState<number | null>(null);
  const [revealed,     setRevealed]     = useState(false);
  const [liveStats,    setLiveStats]    = useState<LiveStats | null>(null);
  const [topQuizzes,   setTopQuizzes]   = useState<TopQuiz[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Auto-reset the sample question every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSelected(null);
      setRevealed(false);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live stats and most-played quizzes
  useEffect(() => {
    async function load() {
      const [{ data: qData }, { data: lb }] = await Promise.all([
        supabase.from("questions").select("category"),
        supabase.rpc("get_leaderboard_by_quiz"),
      ]);

      const questionCount  = qData?.length ?? 0;
      const categoryCount  = new Set(qData?.map((r) => r.category)).size;

      const quizMap: Record<string, number> = {};
      let totalPlays = 0;
      for (const row of lb ?? []) {
        quizMap[row.quiz_id] = (quizMap[row.quiz_id] ?? 0) + Number(row.sessions_played);
        totalPlays += Number(row.sessions_played);
      }

      setLiveStats({ questions: questionCount, categories: categoryCount, plays: totalPlays });
      setTopQuizzes(
        Object.entries(quizMap)
          .map(([quiz_id, total_plays]) => ({ quiz_id, total_plays }))
          .sort((a, b) => b.total_plays - a.total_plays)
          .slice(0, 6)
      );
      setStatsLoading(false);
    }
    load();
  }, []);

  function handleAnswer(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer { from{background-position:-400px 0} to{background-position:400px 0} }

        .display { font-family: 'Sora', sans-serif; }

        /* Hero */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 2rem);
        }
        @media (max-width: 720px) {
          .hero { grid-template-columns: 1fr; }
          .hero-preview { display: none; }
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: #E8E6FF; color: #4F46E5;
          font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 99px; margin-bottom: 1.25rem;
        }
        .hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #4F46E5; }

        .hero-title { font-family: 'Sora', sans-serif; font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 700; color: #1A1A2E; line-height: 1.15; letter-spacing: -1px; margin-bottom: 1.25rem; }
        .hero-title em { font-style: normal; color: #4F46E5; }
        .hero-body { font-size: 16px; color: #6B7280; line-height: 1.7; margin-bottom: 2rem; max-width: 440px; }

        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-primary { padding: 12px 28px; background: #4F46E5; color: #fff; font-size: 15px; font-weight: 600; border-radius: 10px; text-decoration: none; transition: background 0.15s, transform 0.1s; display: inline-block; }
        .btn-primary:hover { background: #4338CA; transform: translateY(-1px); }
        .btn-secondary { padding: 12px 28px; background: transparent; color: #1A1A2E; font-size: 15px; font-weight: 500; border-radius: 10px; text-decoration: none; border: 1.5px solid #D1D5DB; transition: border-color 0.15s, background 0.15s; display: inline-block; }
        .btn-secondary:hover { border-color: #4F46E5; background: #F5F4FF; }

        /* Question preview card */
        .preview-card {
          background: #fff; border-radius: 18px; padding: 1.75rem;
          border: 1px solid #E5E3DC;
          box-shadow: 0 4px 24px rgba(79,70,229,0.07);
        }
        .preview-tag { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 1rem; }
        .preview-q { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #1A1A2E; line-height: 1.5; margin-bottom: 1.25rem; }

        .answer-btn {
          width: 100%; text-align: left; padding: 11px 16px;
          background: #F8F7F4; border: 1.5px solid #E5E3DC;
          border-radius: 10px; font-size: 14px; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.15s; margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .answer-btn:last-child { margin-bottom: 0; }
        .answer-btn:hover:not(:disabled) { border-color: #4F46E5; background: #F5F4FF; color: #4F46E5; }
        .answer-btn:disabled { cursor: default; }
        .answer-btn.correct { background: #DCFCE7; border-color: #16A34A; color: #166534; }
        .answer-btn.wrong   { background: #FEE2E2; border-color: #DC2626; color: #991B1B; }
        .answer-letter { width: 22px; height: 22px; border-radius: 6px; background: #E5E3DC; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .correct .answer-letter { background: #16A34A; color: #fff; }
        .wrong   .answer-letter { background: #DC2626; color: #fff; }

        /* Stats strip */
        .stats-strip {
          max-width: 1100px; margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 2rem) 4rem;
          display: flex; gap: 1px;
          border-top: 1px solid #E5E3DC;
        }
        .stat {
          flex: 1; padding: 2rem 1.5rem;
          border-right: 1px solid #E5E3DC;
        }
        .stat:last-child { border-right: none; }
        .stat-value { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 700; color: #1A1A2E; letter-spacing: -1px; }
        .stat-label { font-size: 13px; color: #9CA3AF; margin-top: 2px; }

        /* Quiz grid */
        .section {
          max-width: 1100px; margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 2rem) 5rem;
        }
        .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; }
        .section-title { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 700; color: #1A1A2E; }
        .section-link { font-size: 14px; color: #4F46E5; font-weight: 500; text-decoration: none; }
        .section-link:hover { text-decoration: underline; }

        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .quiz-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #E5E3DC; padding: 1.25rem 1.5rem;
          text-decoration: none; display: block;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .quiz-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(26,26,46,0.08); }

        .quiz-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
        .category-pill { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #4F46E5; background: #E8E6FF; padding: 3px 10px; border-radius: 99px; }
        .difficulty-pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; }

        .quiz-card-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #1A1A2E; margin-bottom: 0.5rem; line-height: 1.4; }
        .quiz-card-meta { font-size: 12px; color: #9CA3AF; display: flex; gap: 12px; }

        /* Footer */
        .footer {
          border-top: 1px solid #E5E3DC;
          padding: 2rem clamp(1.5rem, 5vw, 4rem);
          display: flex; align-items: center; justify-content: space-between;
          font-size: 13px; color: #9CA3AF;
        }
        .footer-logo { font-family: 'Sora', sans-serif; font-weight: 700; color: #1A1A2E; }
        .footer-logo span { color: #4F46E5; }
      `}</style>

      {/* ── Nav ── */}
      <Nav links={[
        { href: "/quizzes",     label: "Browse" },
        { href: "/leaderboard", label: "Leaderboard" },
      ]} />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Trivia &amp; practice quizzes
          </div>
          <h1 className="hero-title display">
            Test what you<br /><em>actually</em> know.
          </h1>
          <p className="hero-body">
            Hundreds of quizzes across history, science, geography, and more.
            Track your progress, climb the leaderboard, and fill the gaps.
          </p>
          <div className="hero-actions">
            <Link href="/quizzes" className="btn-primary">Browse quizzes</Link>
            {!user && (
              <Link href="/login" className="btn-secondary">Sign in to track progress</Link>
            )}
          </div>
        </div>

        {/* Animated sample question */}
        <div className="hero-preview">
          <div className="preview-card">
            <p className="preview-tag">Sample question — Science</p>
            <p className="preview-q">{SAMPLE_QUESTION.text}</p>
            {SAMPLE_QUESTION.answers.map((ans, idx) => {
              let className = "answer-btn";
              if (revealed) {
                if (idx === SAMPLE_QUESTION.correct) className += " correct";
                else if (idx === selected && idx !== SAMPLE_QUESTION.correct) className += " wrong";
              }
              const letters = ["A", "B", "C", "D"];
              return (
                <button
                  key={idx}
                  className={className}
                  onClick={() => handleAnswer(idx)}
                  disabled={revealed}
                >
                  <span className="answer-letter">{letters[idx]}</span>
                  {ans}
                </button>
              );
            })}
            {revealed && (
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: "0.75rem", lineHeight: 1.5 }}>
                {selected === SAMPLE_QUESTION.correct
                  ? "Correct! Saturn has 146 confirmed moons — more than any other planet."
                  : `Not quite. The answer is Saturn, with 146 confirmed moons.`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        {statsLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="stat">
              <div style={{ height: 36, width: 80, borderRadius: 8, background: "linear-gradient(90deg,#EFEDE7 25%,#E5E3DC 50%,#EFEDE7 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s infinite" }} />
              <div style={{ height: 13, width: 60, marginTop: 6, borderRadius: 6, background: "linear-gradient(90deg,#EFEDE7 25%,#E5E3DC 50%,#EFEDE7 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s infinite" }} />
            </div>
          ))
        ) : (
          <>
            <div className="stat">
              <div className="stat-value display">{liveStats?.questions.toLocaleString() ?? "—"}</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat">
              <div className="stat-value display">{liveStats?.categories ?? "—"}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat">
              <div className="stat-value display">{liveStats?.plays.toLocaleString() ?? "—"}</div>
              <div className="stat-label">Quizzes played</div>
            </div>
          </>
        )}
      </div>

      {/* ── Most played quizzes ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title display">Most played</h2>
          <Link href="/quizzes" className="section-link">View all →</Link>
        </div>

        {statsLoading ? (
          <div className="quiz-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 100, borderRadius: 14, background: "linear-gradient(90deg,#EFEDE7 25%,#E5E3DC 50%,#EFEDE7 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s infinite" }} />
            ))}
          </div>
        ) : topQuizzes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#9CA3AF" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E", marginBottom: "0.5rem" }}>No quizzes played yet</div>
            <div style={{ fontSize: 14, marginBottom: "1.25rem" }}>Be the first to set the leaderboard.</div>
            <Link href="/quizzes" className="btn-primary" style={{ display: "inline-block" }}>Browse quizzes</Link>
          </div>
        ) : (
          <div className="quiz-grid">
            {topQuizzes.map((quiz) => (
              <Link key={quiz.quiz_id} href={`/quiz/${quiz.quiz_id}`} className="quiz-card">
                <p className="quiz-card-title">{QUIZ_NAMES[quiz.quiz_id] ?? quiz.quiz_id}</p>
                <div className="quiz-card-meta">
                  <span>{quiz.total_plays.toLocaleString()} {quiz.total_plays === 1 ? "play" : "plays"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo display">Quiz<span>Sharp</span></div>
        <div>Built with Next.js · Your data, your progress</div>
      </footer>

    </div>
  );
}
