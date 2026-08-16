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

// save a new token if the backend refreshed one for us, otherwise
// kick back to login if it's really expired
api.interceptors.response.use(
  (res) => {
    const newAccessToken = res.headers['x-new-access-token'];
    const newRefreshToken = res.headers['x-new-refresh-token'];
    if (newAccessToken) localStorage.setItem('access_token', newAccessToken);
    if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
    return res;
  },
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
