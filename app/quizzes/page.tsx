"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

// ── Types ────────────────────────────────────────────────────────────────────
interface QuizSummary {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: number;
  plays: number;
  isNew?: boolean;
}

// ── Quiz catalogue ────────────────────────────────────────────────────────────
const ALL_QUIZZES: QuizSummary[] = [
  { id: "flags",               title: "World Flags",             category: "Geography",   difficulty: "Medium", questions: 10, plays: 0,    isNew: true  },
  { id: "us-state-capitals",  title: "US State Capitals",       category: "Geography",   difficulty: "Medium", questions: 10, plays: 0,    isNew: true  },
  { id: "nfl-divisions",       title: "NFL Divisions",           category: "Sports",      difficulty: "Medium", questions: 6,  plays: 0,    isNew: true  },
  { id: "mlb-divisions",       title: "MLB Divisions",           category: "Sports",      difficulty: "Medium", questions: 6,  plays: 0,    isNew: true  },
  { id: "nba-divisions",       title: "NBA Divisions",           category: "Sports",      difficulty: "Medium", questions: 6,  plays: 0,    isNew: true  },
  { id: "ncaa-conferences",    title: "NCAA Conferences",        category: "Sports",      difficulty: "Hard",   questions: 6,  plays: 0,    isNew: true  },
  { id: "history-ww2",         title: "World War II",            category: "History",     difficulty: "Medium", questions: 15, plays: 1240 },
  { id: "science-space",       title: "Space Exploration",       category: "Science",     difficulty: "Hard",   questions: 12, plays: 980  },
  { id: "geo-capitals",        title: "World Capitals",          category: "Geography",   difficulty: "Easy",   questions: 20, plays: 2310 },
  { id: "pop-culture-90",      title: "90s Nostalgia",           category: "Pop Culture", difficulty: "Easy",   questions: 10, plays: 3100 },
  { id: "science-bio",         title: "Human Biology",           category: "Science",     difficulty: "Hard",   questions: 18, plays: 760  },
  { id: "history-ancient",     title: "Ancient Civilizations",   category: "History",     difficulty: "Medium", questions: 14, plays: 890  },
  { id: "sports-olympics",     title: "Olympic History",         category: "Sports",      difficulty: "Medium", questions: 16, plays: 540  },
  { id: "science-chem",        title: "Chemistry Basics",        category: "Science",     difficulty: "Easy",   questions: 12, plays: 1100 },
  { id: "history-us",          title: "U.S. Presidents",         category: "History",     difficulty: "Easy",   questions: 20, plays: 1980 },
  { id: "pop-culture-movies",  title: "Movie Trivia",            category: "Pop Culture", difficulty: "Medium", questions: 18, plays: 2750 },
  { id: "sports-football",     title: "Football Legends",        category: "Sports",      difficulty: "Hard",   questions: 14, plays: 690  },
  { id: "geo-landmarks",       title: "Famous Landmarks",        category: "Geography",   difficulty: "Easy",   questions: 15, plays: 1340 },
  { id: "science-physics",     title: "Physics Fundamentals",    category: "Science",     difficulty: "Hard",   questions: 10, plays: 430  },
  { id: "tech-internet",       title: "History of the Internet", category: "Technology",  difficulty: "Medium", questions: 12, plays: 870  },
];

const CATEGORIES  = ["All", "History", "Science", "Geography", "Pop Culture", "Sports", "Technology"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;

const DIFFICULTY_COLOR: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: "#DCFCE7", color: "#166534" },
  Medium: { bg: "#FEF9C3", color: "#854D0E" },
  Hard:   { bg: "#FEE2E2", color: "#991B1B" },
};

const CATEGORY_ICON: Record<string, string> = {
  History: "🏛", Science: "🔬", Geography: "🌍",
  "Pop Culture": "🎬", Sports: "🏆", Technology: "💻",
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function QuizzesPage() {
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[number]>("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_QUIZZES.filter((quiz) => {
      if (category !== "All" && quiz.category !== category) return false;
      if (difficulty !== "All" && quiz.difficulty !== difficulty) return false;
      if (q && !quiz.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, category, difficulty]);

  const hasFilters = category !== "All" || difficulty !== "All" || search.trim() !== "";

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setDifficulty("All");
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .b-shell {
          max-width: 1100px; margin: 0 auto;
          padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 5vw, 2rem) 5rem;
        }

        /* Header */
        .b-header { margin-bottom: 2rem; }
        .b-title { font-family: 'Sora', sans-serif; font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 700; color: #1A1A2E; letter-spacing: -1px; margin-bottom: 0.5rem; }
        .b-subtitle { font-size: 15px; color: #6B7280; }

        /* Search */
        .search-wrap { position: relative; margin-bottom: 1.25rem; }
        .search-input {
          width: 100%; padding: 13px 16px 13px 44px;
          border: 1.5px solid #E5E3DC; border-radius: 12px;
          font-size: 15px; font-family: 'Inter', sans-serif; color: #1A1A2E;
          background: #fff; transition: border-color 0.15s;
        }
        .search-input:focus { outline: none; border-color: #4F46E5; }
        .search-input::placeholder { color: #9CA3AF; }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none; }

        /* Filter pills */
        .filter-group { margin-bottom: 0.75rem; }
        .filter-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 0.6rem; display: block; }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .pill {
          padding: 7px 16px; border-radius: 99px; font-size: 13px; font-weight: 600;
          border: 1.5px solid #E5E3DC; background: #fff; color: #4B5563;
          cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .pill:hover { border-color: #4F46E5; color: #4F46E5; }
        .pill.active { background: #4F46E5; border-color: #4F46E5; color: #fff; }
        .pill.active:hover { background: #4338CA; }

        /* Results bar */
        .results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin: 1.5rem 0 1.25rem;
          padding-top: 1.25rem; border-top: 1px solid #E5E3DC;
        }
        .results-count { font-size: 13px; color: #9CA3AF; }
        .results-count strong { color: #1A1A2E; font-weight: 600; }
        .clear-btn { font-size: 13px; font-weight: 600; color: #4F46E5; background: none; border: none; cursor: pointer; padding: 0; font-family: 'Inter', sans-serif; }
        .clear-btn:hover { text-decoration: underline; }

        /* Grid */
        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        @keyframes cardIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .quiz-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #E5E3DC; padding: 1.25rem 1.5rem;
          text-decoration: none; display: block;
          transition: transform 0.15s, box-shadow 0.15s;
          animation: cardIn 0.3s ease both;
          position: relative;
        }
        .quiz-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(26,26,46,0.08); }

        .quiz-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
        .category-pill { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #4F46E5; background: #E8E6FF; padding: 3px 10px; border-radius: 99px; display: inline-flex; align-items: center; gap: 4px; }
        .difficulty-pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; }

        .quiz-card-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #1A1A2E; margin-bottom: 0.5rem; line-height: 1.4; }
        .quiz-card-meta { font-size: 12px; color: #9CA3AF; display: flex; gap: 12px; align-items: center; }

        /* NEW badge */
        .new-badge {
          position: absolute; top: -1px; right: 14px;
          background: #4F46E5; color: #fff;
          font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 8px;
          border-radius: 0 0 8px 8px;
        }

        /* Random tag */
        .random-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; color: #7C3AED;
          background: #F5F3FF; padding: 2px 8px; border-radius: 99px;
        }

        /* Empty state */
        .empty-state {
          text-align: center; padding: 4rem 2rem;
          border: 1.5px dashed #E5E3DC; border-radius: 16px;
        }
        .empty-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 600; color: #1A1A2E; margin-bottom: 0.5rem; }
        .empty-body { font-size: 14px; color: #9CA3AF; margin-bottom: 1.25rem; }
        .empty-btn { display: inline-block; padding: 10px 24px; border-radius: 10px; background: #4F46E5; color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: 'Inter', sans-serif; }
        .empty-btn:hover { background: #4338CA; }
      `}</style>

      <Nav links={[{ href: "/quizzes", label: "Browse" }]} />

      <div className="b-shell">

        {/* ── Header ── */}
        <div className="b-header">
          <h1 className="b-title">Browse quizzes</h1>
          <p className="b-subtitle">Search by title, or filter by category and difficulty.</p>
        </div>

        {/* ── Search ── */}
        <div className="search-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search quizzes by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Category filter ── */}
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <div className="pill-row">
            {CATEGORIES.map((c) => (
              <button key={c} className={`pill${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>
                {c !== "All" && CATEGORY_ICON[c]} {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Difficulty filter ── */}
        <div className="filter-group">
          <span className="filter-label">Difficulty</span>
          <div className="pill-row">
            {DIFFICULTIES.map((d) => (
              <button key={d} className={`pill${difficulty === d ? " active" : ""}`} onClick={() => setDifficulty(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results bar ── */}
        <div className="results-bar">
          <div className="results-count">
            <strong>{filtered.length}</strong> {filtered.length === 1 ? "quiz" : "quizzes"} found
          </div>
          {hasFilters && (
            <button className="clear-btn" onClick={clearFilters}>Clear filters</button>
          )}
        </div>

        {/* ── Grid or empty state ── */}
        {filtered.length > 0 ? (
          <div className="quiz-grid">
            {filtered.map((quiz, idx) => {
              const diff = DIFFICULTY_COLOR[quiz.difficulty];
              return (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="quiz-card"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {quiz.isNew && <span className="new-badge">New</span>}

                  <div className="quiz-card-top">
                    <span className="category-pill">
                      {CATEGORY_ICON[quiz.category]} {quiz.category}
                    </span>
                    <span className="difficulty-pill" style={{ background: diff.bg, color: diff.color }}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <p className="quiz-card-title">{quiz.title}</p>

                  <div className="quiz-card-meta">
                    <span>{quiz.questions} questions</span>
                    {quiz.isNew ? (
                      <span className="random-tag">🎲 Random each time</span>
                    ) : (
                      <span>{quiz.plays.toLocaleString()} plays</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-title">No quizzes match those filters</div>
            <div className="empty-body">Try a different category, difficulty, or search term.</div>
            <button className="empty-btn" onClick={clearFilters}>Clear filters</button>
          </div>
        )}

      </div>
    </div>
  );
}
