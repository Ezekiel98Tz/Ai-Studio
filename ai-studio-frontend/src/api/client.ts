import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default api;