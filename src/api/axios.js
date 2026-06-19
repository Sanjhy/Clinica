import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const sesion = localStorage.getItem('usuario_sesion');
  if (sesion) {
    const { accessToken } = JSON.parse(sesion);
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;