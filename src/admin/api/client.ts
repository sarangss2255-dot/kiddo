import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? DEFAULT_API_URL,
});

export function setApiToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
