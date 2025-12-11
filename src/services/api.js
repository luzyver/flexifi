/**
 * API Service - Centralized API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined. Please check your .env files.");
}

class ApiError extends Error {
  constructor(status, message, sessionInvalidated = false) {
    super(message);
    this.status = status;
    this.sessionInvalidated = sessionInvalidated;
  }
}

/**
 * Base fetch wrapper with auth
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new ApiError(res.status, data.error || 'Request failed', data.sessionInvalidated);
  }

  return data;
}

// Auth API
export const authApi = {
  login: (username, password) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    fetchWithAuth('/auth/logout', { method: 'POST' }).catch(() => {}),

  refreshToken: () =>
    fetchWithAuth('/auth/refresh_token', { method: 'POST' }),
};

// Transactions API
export const transactionsApi = {
  getAll: (signal) =>
    fetchWithAuth('/transactions/all', { signal }),

  create: (transaction) =>
    fetchWithAuth('/transactions/all', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),

  update: (id, transaction) =>
    fetchWithAuth(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    }),

  delete: (id) =>
    fetchWithAuth(`/transactions/${id}`, { method: 'DELETE' }),
};

// Categories API
export const categoriesApi = {
  getAll: () => fetchWithAuth('/categories'),
  
  delete: (id) =>
    fetchWithAuth(`/categories/${id}`, { method: 'DELETE' }),
};

export { ApiError, API_BASE_URL };
