import axios from 'axios';

// 1. Ana API Bağlantın (Adres düzeltildi!)
const api = axios.create({
  baseURL: 'https://campify-api-l1vf.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// 2. Gönderi API'si (Eski kodların bozulmaması için aynı canlı adrese yönlendirildi)
export const postApi = axios.create({
  baseURL: 'https://campify-api-l1vf.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor (Kullanıcı giriş yaptıysa token'ı otomatik ekler)
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