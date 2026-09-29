import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { auth } from '../../firebase';
import {
  AUTH_STORAGE_KEYS,
  clearAdminSession,
  saveAdminSession,
} from '../../lib/auth-session';

const DEFAULT_API_URL = '/api/v1';
const TOKEN_KEY = AUTH_STORAGE_KEYS.token;
const LOGIN_PATH = '/admin/auth/login';

/** Emitted when the admin session cannot be refreshed and must be recreated. */
export const ADMIN_SESSION_EXPIRED_EVENT = 'kiddo:admin-session-expired';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
  timeout: 30_000,
});

// Interceptor to automatically attach the latest token from local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Sync the token with localStorage.
 * Bridged to support existing callers in the admin dashboard.
 */
export function setApiToken(token?: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Access tokens live for 15 minutes. When one expires the dashboard must not
 * dead-end on 401s: exchange the still-valid Firebase session for a fresh
 * admin token and retry the request.
 */
let reauthPromise: Promise<string | null> | null = null;

async function reauthenticateAdmin(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const idToken = await currentUser.getIdToken();
  const { data } = await axios.post(
    `${api.defaults.baseURL}${LOGIN_PATH}`,
    { idToken },
    { timeout: 30_000 },
  );

  const dbUser = data?.user ?? {};
  saveAdminSession(data.accessToken, {
    id: String(dbUser.id ?? dbUser._id ?? ''),
    role: String(dbUser.role ?? ''),
    firstName: dbUser.firstName || 'Admin',
    lastName: dbUser.lastName || '',
    email: dbUser.email || '',
  });

  return data.accessToken as string;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    if (status === 401 && original && !original._retried && !url.includes(LOGIN_PATH)) {
      original._retried = true;

      try {
        if (!reauthPromise) {
          reauthPromise = reauthenticateAdmin().finally(() => {
            reauthPromise = null;
          });
        }
        const token = await reauthPromise;
        if (token) {
          original.headers.set('Authorization', `Bearer ${token}`);
          return api(original);
        }
      } catch {
        // Session could not be refreshed; fall through to cleanup.
      }

      clearAdminSession();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
      }
    }

    return Promise.reject(error);
  },
);
