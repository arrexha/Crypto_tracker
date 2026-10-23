import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const originalFetch = globalThis.fetch;
const fetch: typeof originalFetch = async (...args) => {
  try {
    return await originalFetch(...args);
  } catch {
    throw new Error(`Can't reach the server at ${API_URL}. Is the backend running?`);
  }
};

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },
};

export class UnauthorizedError extends Error {}

const authFetch = async (path: string, token: string, init: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });

  if (response.status === 401) {
    throw new UnauthorizedError('Your session has expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const favoritesApi = {
  getAll: (token: string): Promise<string[]> => authFetch('/api/favorites', token),

  add: (token: string, cryptoId: string) =>
    authFetch('/api/favorites', token, {
      method: 'POST',
      body: JSON.stringify({ cryptoId }),
    }),

  remove: (token: string, cryptoId: string) =>
    authFetch(`/api/favorites/${encodeURIComponent(cryptoId)}`, token, {
      method: 'DELETE',
    }),
};
