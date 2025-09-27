import axios from 'axios';

// Create an Axios instance with backend base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Request interceptor - Add access token to every request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Always send refresh token too, so backend can refresh if needed
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken;
  }

  return config;
});

// Response interceptor - If backend still returns 401, redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      console.error('Session expired or invalid refresh token.');

      // Clear tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // Redirect to login
      const returnTo = encodeURIComponent(window.location.pathname);
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?returnTo=${returnTo}`;
    }

    return Promise.reject(err);
  },
);

export default api;
