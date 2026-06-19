"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// ── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
}

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitSeconds: number;
  questions: Question[];
}

// ── Static sample quizzes ────────────────────────────────────────────────────
const SAMPLE_QUIZZES: Record<string, Quiz> = {
  "science-space": {
    id: "science-space",
    title: "Space Exploration",
    category: "Science",
    difficulty: "Hard",
    timeLimitSeconds: 120,
    questions: [
      {
        id: "q1",
        text: "Which planet in our solar system has the most moons?",
        answers: ["Mars", "Jupiter", "Saturn", "Uranus"],
        correctIndex: 2,
        explanation: "Saturn has 146 confirmed moons — edging out Jupiter's 95 after a wave of new discoveries in 2023.",
      },
      {
        id: "q2",
        text: "What was the name of the first artificial satellite launched into space?",
        answers: ["Explorer 1", "Vostok 1", "Sputnik 1", "Luna 1"],
        correctIndex: 2,
        explanation: "Sputnik 1 was launched by the Soviet Union on October 4, 1957, becoming the first artificial Earth satellite.",
      },
      {
        id: "q3",
        text: "How long does it take light from the Sun to reach Earth?",
        answers: ["About 8 seconds", "About 8 minutes", "About 8 hours", "About 8 days"],
        correctIndex: 1,
        explanation: "Light travels at 299,792 km/s. The Sun is ~150 million km away, so light takes roughly 8 minutes and 20 seconds.",
      },
      {
        id: "q4",
        text: "Which space telescope was launched in 1990 and is still operational?",
        answers: ["James Webb", "Hubble", "Spitzer", "Chandra"],
        correctIndex: 1,
        explanation: "The Hubble Space Telescope launched April 24, 1990 and continues to operate, capturing iconic deep-field images.",
      },
      {
        id: "q5",
        text: "What is the name of the boundary beyond which nothing can escape a black hole?",
        answers: ["Chandrasekhar limit", "Schwarzschild radius", "Event horizon", "Photon sphere"],
        correctIndex: 2,
        explanation: "The event horizon is the point of no return around a black hole. Beyond it, escape velocity exceeds the speed of light.",
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AccuracyEntry = { attempts: number; accuracy_pct: number };

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const DIFFICULTY_COLOR: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: "#DCFCE7", color: "#166534" },
  Medium: { bg: "#FEF9C3", color: "#854D0E" },
  Hard:   { bg: "#FEE2E2", color: "#991B1B" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Dynamic quiz config ───────────────────────────────────────────────────────
interface DynamicQuizConfig {
  category: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionsPerSession: number | [number, number]; // fixed count or [min, max]
  secondsPerQuestion: number;
  imageAlt: string;
}

const DYNAMIC_QUIZ_CONFIG: Record<string, DynamicQuizConfig> = {
  flags: {
    category: "Flags",
    title: "World Flags",
    difficulty: "Medium",
    questionsPerSession: 10,
    secondsPerQuestion: 15,
    imageAlt: "Flag to identify",
  },
  "nfl-divisions": {
    category: "NFL Divisions",
    title: "NFL Division Challenge",
    difficulty: "Medium",
    questionsPerSession: [4, 8],
    secondsPerQuestion: 20,
    imageAlt: "NFL team logo",
  },
  "mlb-divisions": {
    category: "MLB Divisions",
    title: "MLB Division Challenge",
    difficulty: "Medium",
    questionsPerSession: [4, 8],
    secondsPerQuestion: 20,
    imageAlt: "MLB team logo",
  },
  "nba-divisions": {
    category: "NBA Divisions",
    title: "NBA Division Challenge",
    difficulty: "Medium",
    questionsPerSession: [4, 8],
    secondsPerQuestion: 20,
    imageAlt: "NBA team logo",
  },
  "ncaa-conferences": {
    category: "NCAA Conferences",
    title: "NCAA Conference Challenge",
    difficulty: "Hard",
    questionsPerSession: [4, 8],
    secondsPerQuestion: 20,
    imageAlt: "NCAA team logo",
  },
  "us-state-capitals": {
    category: "US State Capitals",
    title: "US State Capitals",
    difficulty: "Medium",
    questionsPerSession: 10,
    secondsPerQuestion: 15,
    imageAlt: "US state capital",
  },
  "wwii-battles": {
    category: "WWII Battles",
    title: "WWII: Key Battles",
    difficulty: "Medium",
    questionsPerSession: 10,
    secondsPerQuestion: 20,
    imageAlt: "WWII battle",
  },
  "wwii-leaders": {
    category: "WWII Leaders",
    title: "WWII: Leaders & Figures",
    difficulty: "Medium",
    questionsPerSession: 10,
    secondsPerQuestion: 20,
    imageAlt: "WWII leader",
  },
  "wwii-timeline": {
    category: "WWII Timeline",
    title: "WWII: Timeline & Milestones",
    difficulty: "Easy",
    questionsPerSession: 10,
    secondsPerQuestion: 18,
    imageAlt: "WWII milestone",
  },
  "movies-awards": {
    category: "Academy Awards",
    title: "Academy Awards",
    difficulty: "Medium",
    questionsPerSession: 10,
    secondsPerQuestion: 20,
    imageAlt: "Academy Awards",
  },
  "movies-quotes": {
    category: "Movie Quotes",
    title: "Famous Movie Quotes",
    difficulty: "Easy",
    questionsPerSession: 10,
    secondsPerQuestion: 18,
    imageAlt: "Movie quote",
  },
  "movies-villains": {
    category: "Movie Villains",
    title: "Movie Villains",
    difficulty: "Hard",
    questionsPerSession: 10,
    secondsPerQuestion: 20,
    imageAlt: "Movie villain",
  },
};

// ── Fetch dynamic quiz from Supabase ──────────────────────────────────────────
async function fetchDynamicQuiz(quizId: string): Promise<Quiz> {
  const config = DYNAMIC_QUIZ_CONFIG[quizId];
  if (!config) throw new Error(`Unknown quiz: ${quizId}`);

  const { data, error } = await supabase
    .from("questions")
    .select("id, body, correct_answer, wrong_answers, explanation, image_url")
    .eq("category", config.category);

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!data?.length) throw new Error(
    `No questions found for "${config.title}". Make sure migration 003 has been run in the Supabase SQL editor, and that Row Level Security allows public reads:\n\nCREATE POLICY "questions: public read" ON public.questions FOR SELECT USING (true);`
  );

  const qps = config.questionsPerSession;
  const count = typeof qps === "number"
    ? qps
    : Math.floor(Math.random() * (qps[1] - qps[0] + 1)) + qps[0];

  const selected = shuffle(data).slice(0, Math.min(count, data.length));

  const questions: Question[] = selected.map((row) => {
    const wrong: string[] = row.wrong_answers ?? [];
    const pool = shuffle([row.correct_answer, ...wrong]);
    return {
      id: row.id,
      text: row.body,
      answers: pool,
      correctIndex: pool.indexOf(row.correct_answer),
      explanation: row.explanation ?? "",
      imageUrl: row.image_url ?? undefined,
    };
  });

  return {
    id: quizId,
    title: config.title,
    category: config.category,
    difficulty: config.difficulty,
    timeLimitSeconds: questions.length * config.secondsPerQuestion,
    questions,
  };
}

// ── Progress ring (SVG) ───────────────────────────────────────────────────────
function ProgressRing({ current, total }: { current: number; total: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = total > 1 ? current / (total - 1) : 1;
  const dash = circ * progress;

  return (
    <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E8E6FF" strokeWidth="4" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#4F46E5" strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function QuizPage() {
  const params  = useParams();
  const router  = useRouter();
  const quizId  = typeof params.id === "string" ? params.id : "";

  const isStaticQuiz  = quizId in SAMPLE_QUIZZES;
  const isDynamicQuiz = quizId in DYNAMIC_QUIZ_CONFIG;
  const staticQuiz    = isStaticQuiz ? SAMPLE_QUIZZES[quizId] : null;

  const [dynamicQuiz, setDynamicQuiz] = useState<Quiz | null>(null);
  const [loadError,   setLoadError]   = useState<string | null>(null);

  const quiz      = staticQuiz ?? dynamicQuiz;
  const questions = quiz?.questions ?? [];

  // All hook state — initialized conservatively; updated when dynamic quiz loads
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [revealed,    setRevealed]    = useState(false);
  const [answers,     setAnswers]     = useState<(number | null)[]>(
    () => Array(staticQuiz?.questions.length ?? 0).fill(null)
  );
  const [timeLeft,    setTimeLeft]    = useState(staticQuiz?.timeLimitSeconds ?? 150);
  const [timerActive,  setTimerActive]  = useState(isStaticQuiz);
  const [showModal,    setShowModal]    = useState(false);
  const [advancing,    setAdvancing]    = useState(false);
  const [accuracyMap,  setAccuracyMap]  = useState<Map<string, AccuracyEntry>>(new Map());

  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  // Fetch dynamic quiz on mount
  useEffect(() => {
    if (isStaticQuiz) return;
    if (!isDynamicQuiz) {
      setLoadError(`Quiz not found. It may have been removed or the URL is incorrect.`);
      return;
    }
    fetchDynamicQuiz(quizId)
      .then((q: Quiz) => setDynamicQuiz(q))
      .catch((e: Error) => setLoadError(e.message ?? "Failed to load quiz"));
  }, [isStaticQuiz, isDynamicQuiz, quizId]);

  // Bootstrap state once dynamic quiz arrives
  useEffect(() => {
    if (!dynamicQuiz) return;
    setAnswers(Array(dynamicQuiz.questions.length).fill(null));
    setTimeLeft(dynamicQuiz.timeLimitSeconds);
    setCurrentIdx(0);
    setTimerActive(true);
  }, [dynamicQuiz]);

  // Fetch per-question historical accuracy for signed-in users
  useEffect(() => {
    if (!dynamicQuiz) return;
    const ids = dynamicQuiz.questions.map((q) => q.id).filter((id) => UUID_RE.test(id));
    if (!ids.length) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("question_accuracy_by_user")
        .select("question_id, attempts, accuracy_pct")
        .eq("user_id", user.id)
        .in("question_id", ids)
        .then(({ data }) => {
          if (!data?.length) return;
          setAccuracyMap(new Map(
            data.map((r) => [
              r.question_id,
              { attempts: Number(r.attempts), accuracy_pct: Math.round(Number(r.accuracy_pct)) },
            ])
          ));
        });
    });
  }, [dynamicQuiz]);

  const question = questions[currentIdx];
  const acc      = question ? accuracyMap.get(question.id) : undefined;
  const isLast   = currentIdx === questions.length - 1;

  const correctCount = answers.filter((a, i) => a !== null && a === questions[i]?.correctIndex).length;
  const scorePct     = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          setShowModal(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [timerActive]);

  const timeLimitSeconds = quiz?.timeLimitSeconds ?? 150;
  const timerPct         = timeLeft / timeLimitSeconds;
  const timerColor       = timerPct > 0.4 ? "#4F46E5" : timerPct > 0.2 ? "#D97706" : "#DC2626";
  const timerUrgent      = timerPct <= 0.2;

  // Advance to next question
  const advance = useCallback(() => {
    setAdvancing(true);
    advanceRef.current = setTimeout(() => {
      if (isLast) {
        setTimerActive(false);
        clearInterval(timerRef.current!);
        setShowModal(true);
      } else {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
        setRevealed(false);
        setAdvancing(false);
      }
    }, 1100);
  }, [isLast]);

  function handleAnswer(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const next = [...answers];
    next[currentIdx] = idx;
    setAnswers(next);
    advance();
  }

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current!);
    clearTimeout(advanceRef.current!);
  }, []);

  function handleFinish() {
    const timeUsed     = timeLimitSeconds - timeLeft;
    const answersParam = answers.map((a) => (a === null ? -1 : a)).join(",");

    // Store per-question detail so the results page can write to `responses`
    const responseData = questions.map((q, i) => ({
      questionId:    q.id,
      isCorrect:     answers[i] === q.correctIndex,
      responseValue: answers[i] !== null ? (q.answers[answers[i]] ?? "(no answer)") : "(no answer)",
    }));
    try {
      sessionStorage.setItem(`quiz-responses-${quizId}`, JSON.stringify(responseData));
    } catch { /* private browsing — responses won't be saved */ }

    const query = new URLSearchParams({
      score:   String(correctCount),
      total:   String(questions.length),
      time:    String(timeUsed),
      answers: answersParam,
    });
    router.push(`/quiz/${quizId}/results?${query.toString()}`);
  }

  const diff        = DIFFICULTY_COLOR[quiz?.difficulty ?? "Medium"];
  const isFlagsQuiz = quiz?.category === "Flags";
  const dynConfig   = DYNAMIC_QUIZ_CONFIG[quizId];
  const imgClass    = isFlagsQuiz ? "flag-img" : "team-logo";
  const imgAlt      = dynConfig?.imageAlt ?? "Image";

  // ── Shared styles ──────────────────────────────────────────────────────────
  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .quiz-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 clamp(1.5rem, 5vw, 4rem); height: 64px;
      border-bottom: 1px solid #E5E3DC; background: #F8F7F4;
      position: sticky; top: 0; z-index: 50;
    }
    .quiz-nav-logo { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #1A1A2E; letter-spacing: -0.5px; text-decoration: none; }
    .quiz-nav-logo span { color: #4F46E5; }
    .quit-btn { padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #6B7280; background: transparent; border: 1px solid #E5E3DC; cursor: pointer; text-decoration: none; transition: all 0.15s; }
    .quit-btn:hover { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }
  `;

  // ── Error screen ────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
        <style>{sharedStyles}</style>
        <nav className="quiz-nav">
          <Link href="/" className="quiz-nav-logo">Quiz<span>Sharp</span></Link>
          <Link href="/quizzes" className="quit-btn">Back to quizzes</Link>
        </nav>
        <div style={{ maxWidth: 480, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.75rem" }}>
            Could not load quiz
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: "1.5rem" }}>{loadError}</p>
          <button
            style={{ padding: "12px 28px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (!quiz) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
        <style>{`
          ${sharedStyles}
          @keyframes spin { to { transform: rotate(360deg); } }
          .loader { width: 40px; height: 40px; border: 3px solid #E8E6FF; border-top-color: #4F46E5; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem; }
        `}</style>
        <nav className="quiz-nav">
          <Link href="/" className="quiz-nav-logo">Quiz<span>Sharp</span></Link>
          <Link href="/quizzes" className="quit-btn">Back to quizzes</Link>
        </nav>
        <div style={{ maxWidth: 480, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
          <div className="loader" />
          <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 500 }}>Loading quiz…</p>
        </div>
      </div>
    );
  }

  // ── Quiz UI ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        ${sharedStyles}

        .quiz-shell {
          max-width: 680px; margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 2rem);
        }

        /* Header row: ring + meta + timer */
        .quiz-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; }
        .ring-wrap { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
        .ring-label {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; font-family: 'Sora', sans-serif;
        }
        .ring-current { font-size: 18px; font-weight: 700; color: #1A1A2E; line-height: 1; }
        .ring-total   { font-size: 11px; color: #9CA3AF; }
        .quiz-meta { flex: 1; }
        .quiz-title    { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 4px; }
        .quiz-category { font-size: 12px; color: #9CA3AF; }
        .timer-block { text-align: right; flex-shrink: 0; }
        .timer-value { font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 700; letter-spacing: -1px; transition: color 0.3s; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .timer-urgent { animation: pulse 0.8s ease-in-out infinite; }
        .timer-label  { font-size: 11px; color: #9CA3AF; margin-top: 1px; }

        /* Question card */
        @keyframes slideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .question-card {
          background: #fff; border-radius: 18px; padding: 2rem;
          border: 1px solid #E5E3DC; animation: slideIn 0.25s ease;
        }

        /* Flag / team images */
        .flag-img {
          display: block; width: 100%; max-width: 280px; height: auto;
          margin: 0 auto 1.25rem; border-radius: 10px;
          border: 1px solid #E5E3DC;
          box-shadow: 0 2px 16px rgba(0,0,0,0.10);
        }
        .team-logo {
          display: block; width: auto; max-width: 160px; max-height: 140px;
          margin: 0 auto 1.25rem; object-fit: contain;
        }

        .question-text {
          font-family: 'Sora', sans-serif; font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          font-weight: 600; color: #1A1A2E; line-height: 1.5; margin-bottom: 1.75rem;
        }
        .question-text.flag-q {
          font-size: 0.85rem; font-weight: 500; color: #9CA3AF;
          text-align: center; margin-bottom: 1.25rem;
        }

        /* Answer buttons */
        .answers { display: flex; flex-direction: column; gap: 10px; }
        .answer-btn {
          width: 100%; text-align: left; padding: 14px 18px;
          background: #F8F7F4; border: 1.5px solid #E5E3DC;
          border-radius: 12px; font-size: 15px; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.15s;
          display: flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif;
        }
        .answer-btn:hover:not(:disabled) { border-color: #4F46E5; background: #F5F4FF; color: #4F46E5; }
        .answer-btn:disabled { cursor: default; }
        .answer-btn.correct { background: #DCFCE7 !important; border-color: #16A34A !important; color: #166534 !important; }
        .answer-btn.wrong   { background: #FEE2E2 !important; border-color: #DC2626 !important; color: #991B1B !important; }
        .answer-letter {
          width: 28px; height: 28px; border-radius: 8px;
          background: #E5E3DC; font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all 0.15s;
        }
        .correct .answer-letter { background: #16A34A; color: #fff; }
        .wrong   .answer-letter { background: #DC2626; color: #fff; }

        /* Explanation */
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .explanation {
          margin-top: 1.25rem; padding: 1rem 1.25rem;
          background: #F5F4FF; border-radius: 10px; border-left: 3px solid #4F46E5;
          font-size: 14px; color: #4B5563; line-height: 1.6; animation: fadeIn 0.2s ease;
        }
        .explanation strong { color: #1A1A2E; font-weight: 600; }

        /* Historical accuracy stat */
        .accuracy-stat {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          margin-top: 0.75rem; padding-top: 0.75rem;
          border-top: 1px solid #DDD9F3;
          font-size: 12px; color: #6B7280;
        }
        .accuracy-bar-wrap {
          flex: 1; min-width: 80px; height: 5px;
          background: #E8E6FF; border-radius: 99px; overflow: hidden;
        }
        .accuracy-bar-fill {
          height: 100%; border-radius: 99px; background: #4F46E5;
          transition: width 0.6s ease;
        }
        .accuracy-pct { font-weight: 700; color: #4F46E5; font-size: 13px; }

        /* Auto-advance bar */
        .advancing-bar { height: 3px; background: #E8E6FF; border-radius: 99px; margin-top: 1.5rem; overflow: hidden; }
        @keyframes fillBar { from{width:0} to{width:100%} }
        .advancing-bar-fill { height: 100%; background: #4F46E5; border-radius: 99px; animation: fillBar 1s linear forwards; }

        /* Summary modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(26,26,46,0.5);
          display: flex; align-items: flex-end; justify-content: center; z-index: 200;
        }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .modal {
          background: #fff; border-radius: 24px 24px 0 0; padding: 2rem 2rem 2.5rem;
          width: 100%; max-width: 600px; animation: slideUp 0.35s cubic-bezier(0.32,0.72,0,1);
        }
        .modal-handle { width: 40px; height: 4px; background: #E5E3DC; border-radius: 99px; margin: 0 auto 1.75rem; }
        .modal-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .modal-score-num { font-family: 'Sora', sans-serif; font-size: 3.5rem; font-weight: 700; color: #1A1A2E; letter-spacing: -2px; line-height: 1; }
        .modal-score-pct { font-size: 1rem; color: #9CA3AF; margin-top: 4px; }
        .modal-score-label { font-size: 14px; color: #6B7280; margin-top: 2px; }
        .modal-verdict { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 600; color: #1A1A2E; }
        .modal-breakdown { display: flex; gap: 12px; margin-bottom: 1.75rem; }
        .modal-stat { flex: 1; background: #F8F7F4; border-radius: 12px; padding: 1rem; text-align: center; }
        .modal-stat-val { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 700; color: #1A1A2E; }
        .modal-stat-lbl { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
        .modal-actions { display: flex; gap: 10px; }
        .btn-full { flex: 1; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
        .btn-full-primary { background: #4F46E5; color: #fff; border: none; }
        .btn-full-primary:hover { background: #4338CA; }
        .btn-full-secondary { background: transparent; color: #1A1A2E; border: 1.5px solid #E5E3DC; }
        .btn-full-secondary:hover { border-color: #4F46E5; color: #4F46E5; background: #F5F4FF; }
      `}</style>

      {/* ── Nav ── */}
      <nav className="quiz-nav">
        <Link href="/" className="quiz-nav-logo">Quiz<span>Sharp</span></Link>
        <Link href="/quizzes" className="quit-btn">Quit quiz</Link>
      </nav>

      <div className="quiz-shell">

        {/* ── Header: progress ring + title + timer ── */}
        <div className="quiz-header">
          <div className="ring-wrap">
            <ProgressRing current={currentIdx} total={questions.length} />
            <div className="ring-label">
              <span className="ring-current">{currentIdx + 1}</span>
              <span className="ring-total">of {questions.length}</span>
            </div>
          </div>

          <div className="quiz-meta">
            <div className="quiz-title">{quiz.title}</div>
            <div className="quiz-category">
              {quiz.category} ·{" "}
              <span style={{ ...diff, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                {quiz.difficulty}
              </span>
            </div>
          </div>

          <div className="timer-block">
            <div className={`timer-value${timerUrgent ? " timer-urgent" : ""}`} style={{ color: timerColor }}>
              {formatTime(timeLeft)}
            </div>
            <div className="timer-label">remaining</div>
          </div>
        </div>

        {/* ── Question card ── */}
        {question && (
          <div className="question-card" key={question.id}>
            {question.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.imageUrl}
                alt={imgAlt}
                className={imgClass}
              />
            )}

            <p className={`question-text${question.imageUrl && isFlagsQuiz ? " flag-q" : ""}`}>
              {question.text}
            </p>

            <div className="answers">
              {question.answers.map((ans, idx) => {
                const letters = ["A", "B", "C", "D"];
                let cls = "answer-btn";
                if (revealed) {
                  if (idx === question.correctIndex) cls += " correct";
                  else if (idx === selected)         cls += " wrong";
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleAnswer(idx)}
                    disabled={revealed}
                  >
                    <span className="answer-letter">{letters[idx]}</span>
                    {ans}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="explanation">
                <strong>{selected === question.correctIndex ? "Correct! " : "Not quite. "}</strong>
                {question.explanation}

                {acc && (
                  <div className="accuracy-stat">
                    <span>Your past record:</span>
                    <span className="accuracy-pct">{acc.accuracy_pct}%</span>
                    <div className="accuracy-bar-wrap">
                      <div className="accuracy-bar-fill" style={{ width: `${acc.accuracy_pct}%` }} />
                    </div>
                    <span>({acc.attempts} attempt{acc.attempts !== 1 ? "s" : ""})</span>
                  </div>
                )}
              </div>
            )}

            {advancing && (
              <div className="advancing-bar">
                <div className="advancing-bar-fill" />
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Summary modal ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-handle" />

            <div className="modal-score-row">
              <div>
                <div className="modal-score-num">
                  {correctCount}<span style={{ fontSize: "1.5rem", color: "#9CA3AF" }}>/{questions.length}</span>
                </div>
                <div className="modal-score-label">
                  {scorePct >= 80 ? "Excellent work!" : scorePct >= 60 ? "Good effort!" : "Keep practicing!"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="modal-verdict" style={{ color: scorePct >= 80 ? "#16A34A" : scorePct >= 60 ? "#D97706" : "#DC2626" }}>
                  {scorePct}%
                </div>
                <div className="modal-score-pct">score</div>
              </div>
            </div>

            <div className="modal-breakdown">
              <div className="modal-stat">
                <div className="modal-stat-val" style={{ color: "#16A34A" }}>{correctCount}</div>
                <div className="modal-stat-lbl">Correct</div>
              </div>
              <div className="modal-stat">
                <div className="modal-stat-val" style={{ color: "#DC2626" }}>{questions.length - correctCount}</div>
                <div className="modal-stat-lbl">Wrong</div>
              </div>
              <div className="modal-stat">
                <div className="modal-stat-val">{formatTime(timeLimitSeconds - timeLeft)}</div>
                <div className="modal-stat-lbl">Time used</div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-full btn-full-secondary" onClick={() => window.location.reload()}>
                Try again
              </button>
              <button className="btn-full btn-full-primary" onClick={handleFinish}>
                See full results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
