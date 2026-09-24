import { auth } from './firebase';

const PROD_API_BASE_URL = '/api/v1';
const TOKEN_KEY = 'kiddo_token';

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_GET_RETRIES = 2;
const MAX_RETRY_AFTER_MS = 10_000;
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

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
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  return PROD_API_BASE_URL;
};

const getHeaders = async () => {
  const token = await tokenStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/** Error carrying the HTTP status and backend error code for better UX. */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function parseError(response: Response): Promise<ApiError> {
  let message = `API Error: ${response.statusText || response.status}`;
  let code: string | undefined;

  try {
    const body = await response.json();
    if (body && typeof body === 'object') {
      if (typeof body.message === 'string' && body.message) message = body.message;
      if (typeof body.code === 'string') code = body.code;
    }
  } catch {
    // Non-JSON error body: keep the generic message.
  }

  return new ApiError(message, response.status, code);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, MAX_RETRY_AFTER_MS);
    }
  }
  return 500 * 2 ** attempt;
}

/** Bounded retry for idempotent GETs only; mutations are never retried. */
async function getWithRetry(url: string, headers: Record<string, string>): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetchWithTimeout(url, { headers });
      if (attempt < MAX_GET_RETRIES && RETRYABLE_STATUS.has(response.status)) {
        await sleep(retryDelayMs(response, attempt));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt >= MAX_GET_RETRIES) throw error;
      await sleep(500 * 2 ** attempt);
    }
  }
}

/** Concurrent identical GETs share one network request. */
const inFlightGets = new Map<string, Promise<Response>>();

function dedupedGet(url: string, headers: Record<string, string>, cacheKey: string): Promise<Response> {
  const existing = inFlightGets.get(cacheKey);
  if (existing) return existing;

  const request = getWithRetry(url, headers);
  inFlightGets.set(cacheKey, request);
  request
    .finally(() => {
      if (inFlightGets.get(cacheKey) === request) inFlightGets.delete(cacheKey);
    })
    .catch(() => {
      // Handled by the caller; this only silences the cleanup chain.
    });

  return request;
}

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
    const url = `${getBaseUrl()}${endpoint}`;
    const cacheKey = `${url}|${headers.Authorization ?? ''}`;
    const response = await dedupedGet(url, headers, cacheKey);
    if (!response.ok) throw await parseError(response);
    return response.json();
  },
  post: async (endpoint: string, data: any) => {
    const headers = await getHeaders();
    const response = await fetchWithTimeout(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },
  patch: async (endpoint: string, data: any) => {
    const headers = await getHeaders();
    const response = await fetchWithTimeout(`${getBaseUrl()}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },
};
