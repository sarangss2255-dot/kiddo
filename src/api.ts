import { auth } from './firebase';

const PROD_API_BASE_URL = 'https://kiddo-backend-l4qf.onrender.com/api/v1';
const LOCAL_API_BASE_URL = 'http://localhost:4000/api/v1';
const TOKEN_KEY = 'kiddo_token';

const tokenStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const getBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  // In dev/localhost, use local backend; otherwise production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return LOCAL_API_BASE_URL;
  }

  return PROD_API_BASE_URL;
};

const getHeaders = async () => {
  const token = await tokenStorage.getItem(TOKEN_KEY);

  if (!token) return {};

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const api = {
  setToken: async (token: string | null) => {
    if (token) {
      await tokenStorage.setItem(TOKEN_KEY, token);
    } else {
      await tokenStorage.removeItem(TOKEN_KEY);
    }
  },
  getFirebaseIdToken: async () => auth.currentUser?.getIdToken(),
  get: async (endpoint: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${getBaseUrl()}${endpoint}`, { headers });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  post: async (endpoint: string, data: any) => {
    const headers = await getHeaders();
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  patch: async (endpoint: string, data: any) => {
    const headers = await getHeaders();
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
};
