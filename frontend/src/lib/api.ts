import axios from 'axios';

// if a Spotify request fails due to expired token, it should refresh token
// if that fails, it shoul redirect user to login - the /auth/login route which will
// redirect to Spotify login page

// creates reusable axios instance
const api = axios.create();

// to catch responses
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Missing refresh token');

        // Ask backend to refresh token
        const res = await axios.post('http://localhost:4000/auth/refresh', {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;
        localStorage.setItem('access_token', newAccessToken); // save new token

        // Update request with the refresh token
        err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry original request
        return axios(err.config);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // clean up tokens before redirecting
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // redirect to login if the token refresh fails
        window.location.href = 'http://localhost:4000/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
