import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshSession() {
    const {
      data: { session: currentSession },
      error: sessionError,
    } = await supabaseBrowser.auth.getSession();

    if (sessionError) {
      setError(sessionError.message);
      return;
    }

    setSession(currentSession);
  }

  useEffect(() => {
    let mounted = true;

    refreshSession().finally(() => {
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const { error: signOutError } = await supabaseBrowser.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      toast.error(signOutError.message);
    } else {
      setSession(null);
      toast.success("Signed out successfully");
    }
  }

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, loading, error, signOut, refreshSession }),
    [session, loading, error],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
