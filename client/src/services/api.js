import axios from 'axios';

// 1. Senin API'n
const api = axios.create({
  baseURL: 'https://campify-api.onrender.com', 
  headers: { 'Content-Type': 'application/json' },
});

// 2. Arkadaşının Gönderi API'si
// src/services/api.js içinde postApi kısmını şöyle güncelle:
export const postApi = axios.create({
  baseURL: 'https://campify-api-l1vf.onrender.com', // Sadece domain kalsın
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor (Token ekleme işlemi ikisi için de ortak olsun)
const setupToken = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

setupToken(api);
setupToken(postApi);

export default api;