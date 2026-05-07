import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Senin (Marya) API'n - Auth ve Profil işlemleri için
const api = axios.create({
  baseURL: 'https://campify-api.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Her isteğe otomatik olarak Token ekler
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;