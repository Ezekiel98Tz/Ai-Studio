import axios from 'axios';

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || `http://${host}:8000`,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    // Always refresh CSRF cookie for mutating requests to ensure we have a valid token
    try {
      await api.get('/sanctum/csrf-cookie');
    } catch (e) {
      console.error('Failed to fetch CSRF cookie', e);
    }
  }
  return config;
});

export default api;
