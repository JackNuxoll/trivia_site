"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Mode = "login" | "signup" | "magic";
type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirectTo") ?? "/";

  const [mode,     setMode]     = useState<Mode>("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [status,   setStatus]   = useState<Status>("idle");
  const [message,  setMessage]  = useState("");

  // If the user is already signed in, send them home
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(redirectTo);
    });
  }, [router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
      });
      if (error) {
        setStatus("error");
        setMessage(error.message);
      } else {
        setStatus("success");
        setMessage("Check your email — we sent you a sign-in link.");
      }
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
      });
      if (error) {
        setStatus("error");
        setMessage(error.message);
      } else {
        setStatus("success");
        setMessage("Account created! Check your email to confirm, then sign in.");
      }
      return;
    }

    // login
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      router.replace(redirectTo);
    }
  }

  const titles: Record<Mode, string> = {
    login:  "Welcome back",
    signup: "Create an account",
    magic:  "Sign in with email",
  };

  const buttonLabels: Record<Mode, string> = {
    login:  "Sign in",
    signup: "Create account",
    magic:  "Send sign-in link",
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Nav ── */
        .l-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1.5rem, 5vw, 4rem); height: 64px;
          border-bottom: 1px solid #E5E3DC; background: #F8F7F4;
        }
        .l-logo { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700;
          color: #1A1A2E; letter-spacing: -0.5px; text-decoration: none; }
        .l-logo span { color: #4F46E5; }
        .l-nav-link { padding: 8px 16px; border-radius: 8px; font-size: 14px;
          font-weight: 500; color: #4B5563; text-decoration: none; transition: background 0.15s; }
        .l-nav-link:hover { background: #EEECFF; color: #4F46E5; }

        /* ── Shell ── */
        .l-shell {
          display: flex; align-items: flex-start; justify-content: center;
          min-height: calc(100vh - 64px);
          padding: clamp(2.5rem, 8vw, 5rem) clamp(1.5rem, 5vw, 2rem);
        }

        /* ── Card ── */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .l-card {
          background: #fff; border-radius: 20px; border: 1px solid #E5E3DC;
          padding: 2.5rem 2rem; width: 100%; max-width: 420px;
          animation: cardIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── Header ── */
        .l-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: #E8E6FF; color: #4F46E5; padding: 4px 12px;
          border-radius: 99px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1rem;
        }
        .l-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #4F46E5; }
        .l-title {
          font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 700;
          color: #1A1A2E; letter-spacing: -0.5px; margin-bottom: 0.4rem; line-height: 1.2;
        }
        .l-subtitle { font-size: 14px; color: #6B7280; margin-bottom: 2rem; line-height: 1.5; }

        /* ── Mode tabs ── */
        .l-tabs { display: flex; gap: 4px; background: #F8F7F4; border-radius: 10px;
          padding: 4px; margin-bottom: 1.75rem; border: 1px solid #EFEDE7; }
        .l-tab {
          flex: 1; padding: 8px 4px; border-radius: 7px; font-size: 13px;
          font-weight: 600; cursor: pointer; border: none; background: transparent;
          color: #6B7280; transition: all 0.15s; font-family: 'Inter', sans-serif;
        }
        .l-tab.active { background: #fff; color: #1A1A2E;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .l-tab:hover:not(.active) { color: #4F46E5; }

        /* ── Form ── */
        .l-field { margin-bottom: 1rem; }
        .l-label { display: block; font-size: 13px; font-weight: 600; color: #374151;
          margin-bottom: 6px; }
        .l-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #E5E3DC;
          border-radius: 10px; font-size: 15px; font-family: 'Inter', sans-serif;
          color: #1A1A2E; background: #fff; transition: border-color 0.15s;
        }
        .l-input:focus { outline: none; border-color: #4F46E5; }
        .l-input::placeholder { color: #9CA3AF; }
        .l-input.error { border-color: #DC2626; }

        /* ── Submit ── */
        .l-submit {
          width: 100%; padding: 13px; border-radius: 11px; background: #4F46E5;
          color: #fff; font-size: 15px; font-weight: 600; border: none;
          cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif;
          margin-top: 0.25rem;
        }
        .l-submit:hover:not(:disabled) { background: #4338CA; transform: translateY(-1px); }
        .l-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── Divider ── */
        .l-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 1.25rem 0; color: #9CA3AF; font-size: 12px; font-weight: 500;
        }
        .l-divider::before, .l-divider::after {
          content: ''; flex: 1; height: 1px; background: #E5E3DC;
        }

        /* ── Magic link button ── */
        .l-magic {
          width: 100%; padding: 11px; border-radius: 11px; background: transparent;
          color: #4F46E5; font-size: 14px; font-weight: 600;
          border: 1.5px solid #C7C4F5; cursor: pointer;
          transition: all 0.15s; font-family: 'Inter', sans-serif;
        }
        .l-magic:hover { background: #F5F4FF; border-color: #4F46E5; }

        /* ── Feedback banners ── */
        .l-banner {
          padding: 11px 14px; border-radius: 10px; font-size: 13px;
          line-height: 1.5; margin-bottom: 1.25rem; display: flex;
          align-items: flex-start; gap: 8px;
        }
        .l-banner.success { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
        .l-banner.error   { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }

        /* ── Footer link ── */
        .l-footer { text-align: center; margin-top: 1.5rem; font-size: 13px; color: #6B7280; }
        .l-footer a { color: #4F46E5; font-weight: 600; text-decoration: none; }
        .l-footer a:hover { text-decoration: underline; }

        /* ── Spinner ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .l-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 6px;
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className="l-nav">
        <Link href="/" className="l-logo">Quiz<span>Sharp</span></Link>
        <Link href="/quizzes" className="l-nav-link">Browse quizzes</Link>
      </nav>

      <div className="l-shell">
        <div className="l-card">

          {/* Header */}
          <div className="l-eyebrow">
            <span className="l-eyebrow-dot" />
            QuizSharp
          </div>
          <h1 className="l-title">{titles[mode]}</h1>
          <p className="l-subtitle">
            {mode === "login"  && "Sign in to track your scores and progress."}
            {mode === "signup" && "Create a free account to save your results."}
            {mode === "magic"  && "We'll email you a link — no password needed."}
          </p>

          {/* Mode tabs (login / sign up only — magic link is below the form) */}
          {mode !== "magic" && (
            <div className="l-tabs">
              <button className={`l-tab${mode === "login"  ? " active" : ""}`} onClick={() => { setMode("login");  setStatus("idle"); setMessage(""); }}>Sign in</button>
              <button className={`l-tab${mode === "signup" ? " active" : ""}`} onClick={() => { setMode("signup"); setStatus("idle"); setMessage(""); }}>Create account</button>
            </div>
          )}

          {/* Feedback banner */}
          {status === "success" && (
            <div className="l-banner success">✓ {message}</div>
          )}
          {status === "error" && (
            <div className="l-banner error">⚠ {message}</div>
          )}

          {/* Form */}
          {status !== "success" && (
            <form onSubmit={handleSubmit}>
              <div className="l-field">
                <label className="l-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`l-input${status === "error" ? " error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {mode !== "magic" && (
                <div className="l-field">
                  <label className="l-label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className={`l-input${status === "error" ? " error" : ""}`}
                    placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </div>
              )}

              <button
                type="submit"
                className="l-submit"
                disabled={status === "loading"}
              >
                {status === "loading" && <span className="l-spinner" />}
                {status === "loading" ? "Please wait…" : buttonLabels[mode]}
              </button>

              {/* Magic link toggle */}
              {mode !== "magic" && (
                <>
                  <div className="l-divider">or</div>
                  <button
                    type="button"
                    className="l-magic"
                    onClick={() => { setMode("magic"); setStatus("idle"); setMessage(""); }}
                  >
                    ✉ Send me a sign-in link instead
                  </button>
                </>
              )}

              {mode === "magic" && (
                <div className="l-footer" style={{ marginTop: "1rem" }}>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#4F46E5", fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
                    onClick={() => { setMode("login"); setStatus("idle"); setMessage(""); }}
                  >
                    ← Back to sign in
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Footer */}
          {mode === "login" && status !== "success" && (
            <div className="l-footer">
              Don&apos;t have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); setStatus("idle"); setMessage(""); }}>
                Create one free
              </a>
            </div>
          )}
          {mode === "signup" && status !== "success" && (
            <div className="l-footer">
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); setStatus("idle"); setMessage(""); }}>
                Sign in
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
