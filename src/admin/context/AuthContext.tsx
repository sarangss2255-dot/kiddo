import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setApiToken } from '../api/client';
import type { AuthUser } from '../types/auth';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login: async (identifier: string, password: string) => {
        // Step 1: Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
        const firebaseUser = userCredential.user;
        
        // Step 2: Retrieve the fresh Firebase ID Token
        const idToken = await firebaseUser.getIdToken();

        // Step 3: Authenticate / obtain MongoDB session profile from the backend auth check
        setApiToken(idToken);
        const { data: dbUser } = await api.get<any>('/auth/me');

        // Step 4: Verify the user role is admin
        if (dbUser.role !== 'admin') {
          await signOut(auth);
          setApiToken(undefined);
          throw new Error('Access denied: You are not authorized as an administrator.');
        }

        const adminUser: AuthUser = {
          id: dbUser._id,
          role: dbUser.role,
          firstName: dbUser.firstName || dbUser.displayName || 'Admin',
          lastName: dbUser.lastName || '',
          email: dbUser.email,
        };

        setToken(idToken);
        setUser(adminUser);
        localStorage.setItem(TOKEN_KEY, idToken);
        localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
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
