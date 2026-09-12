import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';

type SessionContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<SessionContextValue>(() => ({
    configured: isSupabaseConfigured,
    loading,
    session,
    async signIn(email, password) {
      if (!supabase) return 'Authentication is not configured yet.';
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return error?.message ?? null;
    },
    async signUp(email, password) {
      if (!supabase) return 'Authentication is not configured yet.';
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      return error?.message ?? null;
    },
    async signOut() { if (supabase) await supabase.auth.signOut(); },
  }), [loading, session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
