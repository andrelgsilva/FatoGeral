import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de request — injeta JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response — trata erros globais
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      toast.error('Erro de conexão. Verifique sua internet.');
      return Promise.reject(err);
    }

    if (err.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.dispatchEvent(new Event('auth:logout'));
      window.location.href = '/login';
    }

    if (err.response.status === 403) {
      window.location.href = '/acesso-negado';
    }

    return Promise.reject(err);
  }
);