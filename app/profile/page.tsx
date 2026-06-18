"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface TeamResult {
  id: string;
  name: string;
  description: string | null;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E5E3DC",
      borderRadius: 16,
      height,
      marginBottom: "1.5rem",
      backgroundImage: "linear-gradient(90deg,#F8F7F4 25%,#EFEDE7 50%,#F8F7F4 75%)",
      backgroundSize: "400px 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, userProfile, refreshProfile } = useAuth();

  // ── Display name state ──────────────────────────────────────────────────────
  const [displayName,       setDisplayName]       = useState("");
  const [savingName,        setSavingName]         = useState(false);
  const [nameSuccess,       setNameSuccess]        = useState(false);
  const [nameError,         setNameError]          = useState<string | null>(null);
  const nameSuccessTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Team — create form ──────────────────────────────────────────────────────
  const [newTeamName,       setNewTeamName]        = useState("");
  const [newTeamDesc,       setNewTeamDesc]        = useState("");
  const [creatingTeam,      setCreatingTeam]       = useState(false);
  const [createTeamError,   setCreateTeamError]    = useState<string | null>(null);

  // ── Team — join / search ────────────────────────────────────────────────────
  const [searchQuery,       setSearchQuery]        = useState("");
  const [searchResults,     setSearchResults]      = useState<TeamResult[]>([]);
  const [searching,         setSearching]          = useState(false);
  const [joiningTeamId,     setJoiningTeamId]      = useState<string | null>(null);
  const [joinError,         setJoinError]          = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Leave team ──────────────────────────────────────────────────────────────
  const [leavingTeam,       setLeavingTeam]        = useState(false);
  const [leaveHover,        setLeaveHover]         = useState(false);

  // ── Redirect if not authed ──────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.push("/login?redirectTo=/profile");
  }, [loading, user, router]);

  // ── Sync display name input from profile ───────────────────────────────────
  useEffect(() => {
    if (userProfile?.display_name != null) {
      setDisplayName(userProfile.display_name);
    }
  }, [userProfile?.display_name]);

  // ── Debounced team search ───────────────────────────────────────────────────
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from("teams")
        .select("id, name, description")
        .ilike("name", `%${searchQuery.trim()}%`)
        .limit(10);
      setSearchResults((data as TeamResult[]) ?? []);
      setSearching(false);
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchQuery]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleSaveName() {
    if (!user) return;
    setNameError(null);
    setNameSuccess(false);
    setSavingName(true);
    const { error } = await supabase
      .from("users")
      .upsert({ id: user.id, email: user.email!, display_name: displayName.trim() || null }, { onConflict: "id" });
    if (error) {
      setNameError(error.message);
    } else {
      await refreshProfile();
      setNameSuccess(true);
      if (nameSuccessTimer.current) clearTimeout(nameSuccessTimer.current);
      nameSuccessTimer.current = setTimeout(() => setNameSuccess(false), 2000);
    }
    setSavingName(false);
  }

  async function handleLeaveTeam() {
    if (!user) return;
    setLeavingTeam(true);
    await supabase
      .from("users")
      .upsert({ id: user.id, email: user.email!, team_id: null }, { onConflict: "id" });
    await refreshProfile();
    setLeavingTeam(false);
  }

  async function handleCreateTeam() {
    if (!user || !newTeamName.trim()) return;
    setCreateTeamError(null);
    setCreatingTeam(true);
    // Ensure the user row exists in public.users before the FK check on created_by
    await supabase
      .from("users")
      .upsert({ id: user.id, email: user.email! }, { onConflict: "id" });
    const { data: team, error: insertErr } = await supabase
      .from("teams")
      .insert({
        name: newTeamName.trim(),
        description: newTeamDesc.trim() || null,
        created_by: user.id,
      })
      .select()
      .single();
    if (insertErr || !team) {
      setCreateTeamError(insertErr?.message ?? "Failed to create team.");
      setCreatingTeam(false);
      return;
    }
    await supabase.from("users").update({ team_id: team.id }).eq("id", user.id);
    await refreshProfile();
    setNewTeamName("");
    setNewTeamDesc("");
    setCreatingTeam(false);
  }

  async function handleJoinTeam(team: TeamResult) {
    if (!user) return;
    setJoinError(null);
    setJoiningTeamId(team.id);
    const { error } = await supabase
      .from("users")
      .upsert({ id: user.id, email: user.email!, team_id: team.id }, { onConflict: "id" });
    if (error) {
      setJoinError(error.message);
    } else {
      await refreshProfile();
      setSearchQuery("");
      setSearchResults([]);
    }
    setJoiningTeamId(null);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes shimmer { from{background-position:-400px 0} to{background-position:400px 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }

        .profile-shell {
          max-width: 640px;
          margin: 0 auto;
          padding: clamp(2rem,5vw,3rem) clamp(1.5rem,5vw,2rem) 5rem;
          animation: fadeIn 0.3s ease;
        }

        .profile-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.2rem);
          font-weight: 700;
          color: #1A1A2E;
          letter-spacing: -1px;
          margin-bottom: 2rem;
        }

        /* ── Section card ── */
        .section-card {
          background: #fff;
          border: 1px solid #E5E3DC;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .section-label {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9CA3AF;
          margin-bottom: 1rem;
        }

        /* ── Inputs ── */
        .profile-input {
          padding: 10px 14px;
          border: 1.5px solid #E5E3DC;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
          width: 100%;
          font-family: 'Inter', sans-serif;
          color: #1A1A2E;
          background: #fff;
          transition: border-color 0.15s;
        }
        .profile-input:focus { border-color: #4F46E5; }
        .profile-input::placeholder { color: #9CA3AF; }

        /* ── Buttons ── */
        .btn-primary {
          padding: 10px 20px;
          background: #4F46E5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) { background: #4338CA; }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-outline {
          padding: 10px 20px;
          background: #fff;
          color: #374151;
          border: 1.5px solid #E5E3DC;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-outline:hover:not(:disabled) { border-color: #4F46E5; color: #4F46E5; }
        .btn-outline:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-danger-outline {
          padding: 10px 20px;
          background: #fff;
          color: #374151;
          border: 1.5px solid #E5E3DC;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-danger-outline:hover:not(:disabled) { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }
        .btn-danger-outline:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Inline feedback ── */
        .feedback-success {
          font-size: 13px;
          font-weight: 600;
          color: #16A34A;
          animation: fadeIn 0.2s ease;
        }
        .feedback-error {
          font-size: 13px;
          font-weight: 500;
          color: #DC2626;
          margin-top: 0.5rem;
        }

        /* ── Team name link ── */
        .team-name-link {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: #1A1A2E;
          text-decoration: none;
        }
        .team-name-link:hover { text-decoration: underline; }

        /* ── Divider ── */
        .or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.5rem 0;
          color: #9CA3AF;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .or-divider::before, .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E3DC;
        }

        /* ── Search results ── */
        .search-results {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeIn 0.2s ease;
        }
        .search-result-card {
          padding: 12px 14px;
          background: #F8F7F4;
          border: 1.5px solid #E5E3DC;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
          font-family: 'Inter', sans-serif;
        }
        .search-result-card:hover { border-color: #4F46E5; background: #FAFAFF; }
        .search-result-card:disabled { opacity: 0.6; cursor: not-allowed; }
        .search-result-name {
          font-weight: 600;
          font-size: 14px;
          color: #1A1A2E;
        }
        .search-result-desc {
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }

        /* ── Spinner ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 6px;
        }
        .spinner-dark {
          border-color: rgba(79,70,229,0.25);
          border-top-color: #4F46E5;
        }

        .create-team-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>

      <Nav links={[
        { href: "/quizzes",     label: "Browse" },
        { href: "/leaderboard", label: "Leaderboard" },
      ]} />

      <div className="profile-shell">
        <h1 className="profile-title">Your Profile</h1>

        {/* ── Loading skeleton ── */}
        {loading && (
          <>
            <SkeletonCard height={130} />
            <SkeletonCard height={280} />
          </>
        )}

        {/* ── Content (only when auth resolved and user present) ── */}
        {!loading && user && (
          <>
            {/* ═══════════════════════════════════════════════════
                DISPLAY NAME
            ═══════════════════════════════════════════════════ */}
            <div className="section-card">
              <p className="section-label">Display Name</p>

              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current</span>
                <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: "#1A1A2E" }}>
                  {userProfile?.display_name || user.email?.split("@")[0] || user.email}
                </div>
                {!userProfile?.display_name && (
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>email prefix — set a display name below</div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  className="profile-input"
                  type="text"
                  placeholder="e.g. QuizWizard42"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
                  maxLength={50}
                />
                <button
                  className="btn-primary"
                  onClick={handleSaveName}
                  disabled={savingName}
                >
                  {savingName
                    ? <><span className="spinner" />Saving…</>
                    : "Save"}
                </button>
              </div>

              {nameSuccess && (
                <div className="feedback-success" style={{ marginTop: "0.6rem" }}>
                  Saved!
                </div>
              )}
              {nameError && (
                <div className="feedback-error">{nameError}</div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════
                TEAM
            ═══════════════════════════════════════════════════ */}
            <div className="section-card">
              <p className="section-label">Team</p>

              {userProfile?.team_id ? (
                /* ── STATE A: Has a team ── */
                <div>
                  <div style={{ marginBottom: "1rem" }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current team</span>
                    <div style={{ marginTop: 4 }}>
                      <Link
                        href={`/teams/${userProfile.team_id}`}
                        className="team-name-link"
                      >
                        {userProfile.team_name ?? "Your Team"}
                      </Link>
                    </div>
                  </div>

                  <button
                    className="btn-danger-outline"
                    onClick={handleLeaveTeam}
                    disabled={leavingTeam}
                  >
                    {leavingTeam
                      ? <><span className="spinner spinner-dark" style={{ borderTopColor: "#DC2626" }} />Leaving…</>
                      : "Leave team"}
                  </button>
                </div>
              ) : (
                /* ── STATE B: No team ── */
                <div>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current team</span>
                    <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: "#9CA3AF" }}>None</div>
                  </div>
                  {/* Create */}
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: "0.75rem" }}>
                    Create a new team
                  </p>
                  <div className="create-team-grid">
                    <input
                      className="profile-input"
                      type="text"
                      placeholder="Team name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      maxLength={80}
                    />
                    <input
                      className="profile-input"
                      type="text"
                      placeholder="Description (optional)"
                      value={newTeamDesc}
                      onChange={(e) => setNewTeamDesc(e.target.value)}
                      maxLength={200}
                    />
                    <div>
                      <button
                        className="btn-primary"
                        onClick={handleCreateTeam}
                        disabled={creatingTeam || !newTeamName.trim()}
                      >
                        {creatingTeam
                          ? <><span className="spinner" />Creating…</>
                          : "Create team"}
                      </button>
                      {createTeamError && (
                        <div className="feedback-error">{createTeamError}</div>
                      )}
                    </div>
                  </div>

                  <div className="or-divider">or</div>

                  {/* Join */}
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: "0.75rem" }}>
                    Join an existing team
                  </p>
                  <div style={{ position: "relative" }}>
                    <input
                      className="profile-input"
                      type="text"
                      placeholder="Search teams by name…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searching && (
                      <div style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}>
                        <span className="spinner spinner-dark" style={{ marginRight: 0 }} />
                      </div>
                    )}
                  </div>

                  {joinError && (
                    <div className="feedback-error">{joinError}</div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((team) => (
                        <button
                          key={team.id}
                          className="search-result-card"
                          onClick={() => handleJoinTeam(team)}
                          disabled={joiningTeamId === team.id}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                            <div>
                              <div className="search-result-name">{team.name}</div>
                              {team.description && (
                                <div className="search-result-desc">{team.description}</div>
                              )}
                            </div>
                            {joiningTeamId === team.id ? (
                              <span style={{ fontSize: 12, color: "#9CA3AF", flexShrink: 0 }}>Joining…</span>
                            ) : (
                              <span style={{ fontSize: 12, color: "#4F46E5", fontWeight: 600, flexShrink: 0 }}>Join</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery.trim() && !searching && searchResults.length === 0 && (
                    <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: "0.75rem" }}>
                      No teams found for &ldquo;{searchQuery}&rdquo;.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
