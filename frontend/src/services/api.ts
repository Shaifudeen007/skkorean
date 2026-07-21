import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

export const getImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
};

api.interceptors.request.use((config) => {
  const adminData = localStorage.getItem('adminInfo');
  if (adminData) {
    const { token } = JSON.parse(adminData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminInfo');
      // Redirect to login only if not already there to prevent loops
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
