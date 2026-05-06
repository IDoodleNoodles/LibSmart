import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getAuth, getAuthExpiresAt, saveAuth, StoredAuth, AuthRole } from '@/lib/auth';

type AuthUser = {
  userId: number;
  username: string;
  fullName?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  role: AuthRole | null;
  login: (token: string, role: AuthRole, userId: number, username: string, fullName?: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const publicRoutes = ['/welcome', '/login', '/register', '/forgot-password', '/reset-password'];

const getRedirectPath = (role: AuthRole | null, username?: string | null) => (role === 'USER' && username ? `/${username}` : '/');

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-white text-libsmart-slate">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-libsmart-blue border-t-transparent" />
      <p className="text-sm font-medium">Checking session...</p>
    </div>
  </div>
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [initialized, setInitialized] = useState(false);

  const expireSession = useCallback(() => {
    clearAuth();
    setAuth(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
    navigate('/welcome', { replace: true });
  }, [navigate]);

  const login = useCallback((token: string, role: AuthRole, userId: number, username: string, fullName?: string | null) => {
    // saveAuth includes optional fullName so profile info is available immediately
    saveAuth(token, role, userId, username, fullName ?? null);
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    setAuth(getAuth());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const remainingMs = Math.max((getAuthExpiresAt(auth) ?? auth.expiresAt) - Date.now(), 0);
    const timeoutId = window.setTimeout(() => {
      expireSession();
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [auth, expireSession]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (auth && publicRoutes.includes(location.pathname)) {
      navigate(getRedirectPath(auth.role, auth.username), { replace: true });
    }
  }, [auth, initialized, location.pathname, navigate]);

  const value = useMemo<AuthContextValue>(() => ({
    user: auth ? { userId: auth.userId, username: auth.username, fullName: auth.fullName ?? null } : null,
    token: auth?.token ?? null,
    role: auth?.role ?? null,
    login,
    logout,
    isAuthenticated: Boolean(auth),
  }), [auth, login, logout]);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}