import axios from 'axios';

// if a Spotify request fails due to expired token, it should refresh token
// if that fails, it shoul redirect user to login - the /auth/login route which will
// redirect to Spotify login page

// Create an Axios instance with backend base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Request interceptor-  Add access token to every request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor- Refresh token on 401 error
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If 401 unauthorized, try refreshing token
    // this happens when spotify access token has expired
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Missing refresh token');

        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        // we get response from backend and save it in localstorage
        const newAccessToken = refreshRes.data.access_token;
        localStorage.setItem('access_token', newAccessToken);

        // Retry request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clea up tokens, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        const returnTo = encodeURIComponent(window.location.pathname);
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?returnTo=${returnTo}`;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
