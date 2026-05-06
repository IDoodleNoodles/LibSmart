export type AuthRole = 'ADMIN' | 'USER';

export interface StoredAuth {
  token: string;
  role: AuthRole;
  userId: number;
  username: string;
  fullName?: string | null;
  expiresAt: number;
  tokenExpiresAt?: number | null;
}

const AUTH_STORAGE_KEY = 'libsmart_auth';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const isBrowser = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const decodeJwtExp = (token: string) => {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) {
    return null;
  }

  try {
    const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = base64Payload.padEnd(base64Payload.length + ((4 - (base64Payload.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(paddedPayload));
    if (typeof payload.exp !== 'number') {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

const isExpired = (auth: StoredAuth) => {
  const tokenExpiry = decodeJwtExp(auth.token);
  const effectiveExpiry = tokenExpiry ? Math.min(tokenExpiry, auth.expiresAt) : auth.expiresAt;
  return Date.now() >= effectiveExpiry;
};

export const saveAuth = (token: string, role: AuthRole, userId: number, username: string, fullName?: string | null) => {
  if (!isBrowser()) {
    return;
  }

  const tokenExpiresAt = decodeJwtExp(token);

  const auth: StoredAuth = {
    token,
    role,
    userId,
    username,
    fullName: fullName ?? null,
    expiresAt: Date.now() + SESSION_DURATION_MS,
    tokenExpiresAt,
  };

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  window.localStorage.removeItem('auth_token');
  window.localStorage.removeItem('auth_user');
};

export const getAuth = (): StoredAuth | null => {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredAuth;
    if (!parsed?.token || !parsed?.role || !parsed?.username || !parsed?.userId || !parsed?.expiresAt) {
      clearAuth();
      return null;
    }

    if (isExpired(parsed)) {
      clearAuth();
      return null;
    }

    return parsed;
  } catch {
    clearAuth();
    return null;
  }
};

export const clearAuth = () => {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem('auth_token');
  window.localStorage.removeItem('auth_user');
};

export const isAuthenticated = () => Boolean(getAuth());

export const getRole = (): AuthRole | null => getAuth()?.role ?? null;

export const getToken = () => getAuth()?.token ?? null;

export const getAuthExpiresAt = (auth: StoredAuth | null) => {
  if (!auth) {
    return null;
  }

  return auth.tokenExpiresAt ? Math.min(auth.expiresAt, auth.tokenExpiresAt) : auth.expiresAt;
};

export const getAuthUser = () => {
  const auth = getAuth();
  if (!auth) {
    return null;
  }

  return {
    userId: auth.userId,
    username: auth.username,
    fullName: auth.fullName ?? null,
    role: auth.role,
  };
};