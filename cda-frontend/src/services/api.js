import axios from 'axios';

// Creamos una instancia de Axios apuntando al puerto 3000 donde corre tu backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Interceptor: Antes de que salga cualquier petición, revisa si hay un token guardado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;