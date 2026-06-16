"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitSeconds: number;
  questions: Question[];
}

// ── Sample data (replace with fetch('/api/quizzes/[id]') later) ──────────────
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
  "history-ww2": {
    id: "history-ww2",
    title: "World War II",
    category: "History",
    difficulty: "Medium",
    timeLimitSeconds: 90,
    questions: [
      {
        id: "q1",
        text: "In which year did World War II begin?",
        answers: ["1937", "1938", "1939", "1940"],
        correctIndex: 2,
        explanation: "WWII began on September 1, 1939, when Nazi Germany invaded Poland, prompting Britain and France to declare war.",
      },
      {
        id: "q2",
        text: "What was the code name for the Allied invasion of Normandy on June 6, 1944?",
        answers: ["Operation Overlord", "Operation Barbarossa", "Operation Market Garden", "Operation Torch"],
        correctIndex: 0,
        explanation: "Operation Overlord was the codename for the Battle of Normandy. The beach landings themselves were codenamed Operation Neptune.",
      },
      {
        id: "q3",
        text: "Which country suffered the highest number of casualties in World War II?",
        answers: ["Germany", "United States", "Soviet Union", "China"],
        correctIndex: 2,
        explanation: "The Soviet Union suffered an estimated 26–27 million deaths, the most of any nation in the conflict.",
      },
    ],
  },
};

// Fallback for unknown quiz IDs
const FALLBACK_QUIZ = SAMPLE_QUIZZES["science-space"];

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// Arc progress ring (SVG) ─────────────────────────────────────────────────────
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
  const params   = useParams();
  const router   = useRouter();
  const quizId   = typeof params.id === "string" ? params.id : "science-space";
  const quiz     = SAMPLE_QUIZZES[quizId] ?? FALLBACK_QUIZ;
  const questions = quiz.questions;

  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [revealed,    setRevealed]    = useState(false);
  const [answers,     setAnswers]     = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timeLeft,    setTimeLeft]    = useState(quiz.timeLimitSeconds);
  const [timerActive, setTimerActive] = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [advancing,   setAdvancing]   = useState(false);

  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const question = questions[currentIdx];
  const isLast   = currentIdx === questions.length - 1;

  // Score calculation
  const correctCount = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const scorePct     = Math.round((correctCount / questions.length) * 100);

  // ── Timer ──
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

  const timerPct    = timeLeft / quiz.timeLimitSeconds;
  const timerColor  = timerPct > 0.4 ? "#4F46E5" : timerPct > 0.2 ? "#D97706" : "#DC2626";
  const timerUrgent = timerPct <= 0.2;

  // ── Advance to next question ──
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
    }, 1100); // brief pause to show correct/wrong before advancing
  }, [isLast]);

  // ── Answer selection ──
  function handleAnswer(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
    advance();
  }

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current!);
    clearTimeout(advanceRef.current!);
  }, []);

  // ── Redirect after modal ──
  function handleFinish() {
    const timeUsed = quiz.timeLimitSeconds - timeLeft;
    const answersParam = answers.map((a) => (a === null ? -1 : a)).join(",");
    const query = new URLSearchParams({
      score: String(correctCount),
      total: String(questions.length),
      time: String(timeUsed),
      answers: answersParam,
    });
    router.push(`/quiz/${quizId}/results?${query.toString()}`);
  }

  const diff = DIFFICULTY_COLOR[quiz.difficulty];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
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

        .quiz-shell {
          max-width: 680px; margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 2rem);
        }

        /* Header row: ring + meta + timer */
        .quiz-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; }
        .ring-wrap { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
        .ring-label {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif;
        }
        .ring-current { font-size: 18px; font-weight: 700; color: #1A1A2E; line-height: 1; }
        .ring-total   { font-size: 11px; color: #9CA3AF; }

        .quiz-meta { flex: 1; }
        .quiz-title    { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 4px; }
        .quiz-category { font-size: 12px; color: #9CA3AF; }

        .timer-block { text-align: right; flex-shrink: 0; }
        .timer-value {
          font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 700;
          letter-spacing: -1px; transition: color 0.3s;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .timer-urgent { animation: pulse 0.8s ease-in-out infinite; }
        .timer-label  { font-size: 11px; color: #9CA3AF; margin-top: 1px; }

        /* Question card */
        @keyframes slideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .question-card {
          background: #fff; border-radius: 18px; padding: 2rem;
          border: 1px solid #E5E3DC;
          animation: slideIn 0.25s ease;
        }
        .question-text {
          font-family: 'Sora', sans-serif; font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          font-weight: 600; color: #1A1A2E; line-height: 1.5; margin-bottom: 1.75rem;
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
          background: #F5F4FF; border-radius: 10px;
          border-left: 3px solid #4F46E5;
          font-size: 14px; color: #4B5563; line-height: 1.6;
          animation: fadeIn 0.2s ease;
        }
        .explanation strong { color: #1A1A2E; font-weight: 600; }

        /* Advancing indicator */
        .advancing-bar {
          height: 3px; background: #E8E6FF; border-radius: 99px;
          margin-top: 1.5rem; overflow: hidden;
        }
        @keyframes fillBar { from{width:0} to{width:100%} }
        .advancing-bar-fill {
          height: 100%; background: #4F46E5; border-radius: 99px;
          animation: fillBar 1s linear forwards;
        }

        /* Summary modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(26,26,46,0.5);
          display: flex; align-items: flex-end; justify-content: center;
          z-index: 200; padding: 0;
        }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .modal {
          background: #fff; border-radius: 24px 24px 0 0;
          padding: 2rem 2rem 2.5rem;
          width: 100%; max-width: 600px;
          animation: slideUp 0.35s cubic-bezier(0.32,0.72,0,1);
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
            <div
              className={`timer-value${timerUrgent ? " timer-urgent" : ""}`}
              style={{ color: timerColor }}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="timer-label">remaining</div>
          </div>
        </div>

        {/* ── Question card ── */}
        <div className="question-card" key={question.id}>
          <p className="question-text">{question.text}</p>

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

          {/* Explanation appears after answering */}
          {revealed && (
            <div className="explanation">
              <strong>{selected === question.correctIndex ? "Correct! " : "Not quite. "}</strong>
              {question.explanation}
            </div>
          )}

          {/* Thin progress bar shows auto-advance countdown */}
          {advancing && (
            <div className="advancing-bar">
              <div className="advancing-bar-fill" />
            </div>
          )}
        </div>

      </div>

      {/* ── Summary modal ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-handle" />

            <div className="modal-score-row">
              <div>
                <div className="modal-score-num">{correctCount}<span style={{ fontSize: "1.5rem", color: "#9CA3AF" }}>/{questions.length}</span></div>
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
                <div className="modal-stat-val">{formatTime(quiz.timeLimitSeconds - timeLeft)}</div>
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