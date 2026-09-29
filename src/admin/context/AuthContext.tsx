import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_SESSION_EXPIRED_EVENT, api, setApiToken } from '../api/client';
import type { AuthUser } from '../types/auth';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import {
  AUTH_STORAGE_KEYS,
  clearAdminSession,
  isAdminRole,
  saveAdminSession,
} from '../../lib/auth-session';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = AUTH_STORAGE_KEYS.adminToken;
const USER_KEY = AUTH_STORAGE_KEYS.adminUser;

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    setApiToken(token ?? undefined);
  }, [token]);

  // The API client emits this when the access token expired and could not be
  // silently refreshed. Reset local state and send the admin back to sign in.
  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setUser(null);
      clearAdminSession();
      setApiToken(undefined);
      router.replace('/admin/login');
    };

    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpired);
  }, [router]);

  const finishBackendLogin = useCallback(async (idToken: string) => {
    const { data: payload } = await api.post<any>('/admin/auth/login', { idToken });
    const dbUser = payload.user;

    if (!isAdminRole(dbUser.role)) {
      await signOut(auth);
      setApiToken(undefined);
      throw new Error('Access denied: You are not authorized as an administrator.');
    }

    const adminUser: AuthUser = {
      id: dbUser.id,
      role: dbUser.role,
      firstName: dbUser.firstName || 'Admin',
      lastName: dbUser.lastName || '',
      email: dbUser.email,
    };

    setToken(payload.accessToken);
    setUser(adminUser);
    saveAdminSession(payload.accessToken, adminUser);
    setApiToken(payload.accessToken);
  }, []);

  // If a Firebase session already exists (e.g. the user signed in from the main
  // site), complete the admin handshake automatically instead of asking for
  // credentials again.
  useEffect(() => {
    if (token) return;

    let cancelled = false;

    const attemptSilentLogin = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const idToken = await currentUser.getIdToken();
        if (!cancelled && idToken) {
          await finishBackendLogin(idToken);
        }
      } catch {
        // Not an admin account, or the backend is unavailable — fall back to
        // the login form without surfacing a misleading error.
      }
    };

    void attemptSilentLogin();
    return () => {
      cancelled = true;
    };
  }, [token, finishBackendLogin]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login: async (identifier: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
        await finishBackendLogin(await userCredential.user.getIdToken());
      },
      loginWithGoogle: async () => {
        const userCredential = await signInWithPopup(auth, googleProvider);
        await finishBackendLogin(await userCredential.user.getIdToken());
      },
      logout: () => {
        signOut(auth).catch(console.error);
        setToken(null);
        setUser(null);
        clearAdminSession();
        setApiToken(undefined);
      },
    }),
    [token, user, finishBackendLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
