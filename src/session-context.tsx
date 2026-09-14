import type { Session } from '@supabase/supabase-js';
import { Linking } from 'react-native';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';

type SessionContextValue = {
  configured: boolean;
  loading: boolean;
  recoveryMode: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  cancelRecovery: () => void;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function getAuthParams(url: string) {
  const queryIndex = url.indexOf('?');
  const hashIndex = url.indexOf('#');
  const query = queryIndex >= 0 ? url.slice(queryIndex + 1, hashIndex >= 0 ? hashIndex : undefined) : '';
  const hash = hashIndex >= 0 ? url.slice(hashIndex + 1) : '';
  return new URLSearchParams([query, hash].filter(Boolean).join('&'));
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;

    async function handleAuthUrl(url: string | null) {
      if (!url || !supabase) return;
      const params = getAuthParams(url);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const code = params.get('code');
      const type = params.get('type');
      const isRecoveryLink = type === 'recovery' || url.includes('/auth/reset-password');

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && active) setSession(data.session);
      } else if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error && active) setSession(data.session);
      }

      if (isRecoveryLink && active) setRecoveryMode(true);
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    void Linking.getInitialURL().then(handleAuthUrl);

    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      void handleAuthUrl(url);
    });

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
    });

    return () => {
      active = false;
      linkingSubscription.remove();
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionContextValue>(() => ({
    configured: isSupabaseConfigured,
    loading,
    recoveryMode,
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
    async requestPasswordReset(email) {
      if (!supabase) return 'Authentication is not configured yet.';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'forexlearning://auth/reset-password',
      });
      return error?.message ?? null;
    },
    async updatePassword(password) {
      if (!supabase) return 'Authentication is not configured yet.';
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) setRecoveryMode(false);
      return error?.message ?? null;
    },
    cancelRecovery() { setRecoveryMode(false); },
    async signOut() {
      setRecoveryMode(false);
      if (supabase) await supabase.auth.signOut();
    },
  }), [loading, recoveryMode, session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
