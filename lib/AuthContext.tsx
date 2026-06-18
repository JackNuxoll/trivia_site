"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export interface UserProfile {
  display_name: string | null;
  team_id: string | null;
  team_name: string | null;
}

interface AuthContextValue {
  user: User | null;
  /** true while the initial session check is in flight */
  loading: boolean;
  userProfile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  userProfile: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading,     setLoading]     = useState(true);

  async function fetchProfile(userId: string) {
    const { data: userData } = await supabase
      .from('users')
      .select('display_name, team_id')
      .eq('id', userId)
      .single();

    let teamName: string | null = null;
    if (userData?.team_id) {
      const { data: teamData } = await supabase
        .from('teams')
        .select('name')
        .eq('id', userData.team_id)
        .single();
      teamName = teamData?.name ?? null;
    }

    setUserProfile({
      display_name: userData?.display_name ?? null,
      team_id:      userData?.team_id ?? null,
      team_name:    teamName,
    });
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  useEffect(() => {
    // Get the current session on mount
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        await fetchProfile(user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Listen for sign-in / sign-out / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await fetchProfile(nextUser.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
