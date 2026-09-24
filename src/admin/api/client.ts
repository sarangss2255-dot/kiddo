import axios from 'axios';

const DEFAULT_API_URL = '/api/v1';
const TOKEN_KEY = 'kiddo_token';

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
