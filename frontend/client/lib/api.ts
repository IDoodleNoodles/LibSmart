import { clearAuth, getToken } from './auth';

export const API_BASE_URL = (
  import.meta.env.NEXT_PUBLIC_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8081/api'
).replace(/\/$/, '');

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type RequestBody = BodyInit | JsonValue | Record<string, unknown> | undefined;

const buildUrl = (input: RequestInfo | URL) => {
  if (input instanceof URL) {
    return input.toString();
  }

  if (typeof input === 'string' && /^https?:\/\//i.test(input)) {
    return input;
  }

  const path = typeof input === 'string' ? input : input.url;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (!bodyText) {
    return null;
  }

  if (contentType.includes('application/json') || bodyText.trim().startsWith('{') || bodyText.trim().startsWith('[')) {
    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  }

  return bodyText;
};

const getErrorMessage = (body: unknown, fallback: string) => {
  if (!body) {
    return fallback;
  }

  if (typeof body === 'string') {
    return body;
  }

  const errorBody = body as { message?: string; detail?: string; title?: string; error?: string };
  return errorBody.message || errorBody.detail || errorBody.title || errorBody.error || fallback;
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.replace('/login');
  }
};

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init?.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(input), {
    ...init,
    headers,
  });

  if ((response.status === 401 || response.status === 403) && token) {
    clearAuth();
    redirectToLogin();
  }

  return response;
}

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await authFetch(input, init);
  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(body, 'Request failed'));
  }

  return body as T;
}

export async function requestBlob(input: RequestInfo | URL, init?: RequestInit): Promise<Blob> {
  const response = await authFetch(input, init);

  if (!response.ok) {
    const body = await parseResponseBody(response);
    throw new Error(getErrorMessage(body, 'Request failed'));
  }

  return response.blob();
}

export const api = {
  get: async <T>(url: string, options: RequestInit = {}) => requestJson<T>(url, { ...options, method: 'GET' }),
  post: async <T>(url: string, body?: unknown, options: RequestInit = {}) =>
    requestJson<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: async <T>(url: string, body?: unknown, options: RequestInit = {}) =>
    requestJson<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: async <T>(url: string, options: RequestInit = {}) => requestJson<T>(url, { ...options, method: 'DELETE' }),
};