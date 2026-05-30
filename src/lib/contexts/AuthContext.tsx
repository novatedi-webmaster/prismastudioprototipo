import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AuthSession {
  sessionToken: string;
  mustChangePassword: boolean;
}

interface AuthContextType {
  session: AuthSession | null;
  login: (token: string, mustChange: boolean) => void;
  logout: () => void;
  setMustChangePassword: (val: boolean) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = sessionStorage.getItem('prisma_auth_session');
    if (stored) {
      try {
        return JSON.parse(stored) as AuthSession;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (token: string, mustChange: boolean) => {
    const newSession: AuthSession = { sessionToken: token, mustChangePassword: mustChange };
    setSession(newSession);
    sessionStorage.setItem('prisma_auth_session', JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    sessionStorage.removeItem('prisma_auth_session');
  };

  const setMustChangePassword = (val: boolean) => {
    if (session) {
      const updated = { ...session, mustChangePassword: val };
      setSession(updated);
      sessionStorage.setItem('prisma_auth_session', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      login,
      logout,
      setMustChangePassword,
      isAuthenticated: !!session?.sessionToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
