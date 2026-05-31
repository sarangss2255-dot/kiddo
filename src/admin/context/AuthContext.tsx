import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setApiToken } from '../api/client';
import type { AuthUser } from '../types/auth';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'kiddo_admin_token';
const USER_KEY = 'kiddo_admin_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    setApiToken(token ?? undefined);
  }, [token]);

  const finishBackendLogin = async (idToken: string) => {
    const { data: payload } = await api.post<any>('/auth/firebase', { idToken });
    const dbUser = payload.user;

    if (dbUser.role !== 'admin') {
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
    localStorage.setItem(TOKEN_KEY, payload.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
    setApiToken(payload.accessToken);
  };

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
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setApiToken(undefined);
      },
    }),
    [token, user],
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
