import { auth } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROD_API_BASE_URL = 'https://kiddo-backend-l4qf.onrender.com/api/v1';
const LOCAL_API_BASE_URL = 'http://localhost:4000/api/v1';
const TOKEN_KEY = 'kiddo_token';

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
  // Try to get token from AsyncStorage first for immediate availability
  let token = await AsyncStorage.getItem(TOKEN_KEY);
  
  // If Firebase is ready, get a fresh token (this is more reliable)
  const user = auth.currentUser;
  if (user) {
    token = await user.getIdToken();
    // Cache the fresh token
    if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  if (!token) return {};

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const api = {
  setToken: async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  },
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
