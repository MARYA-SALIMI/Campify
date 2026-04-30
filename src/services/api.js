import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'https://campify-api.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Her isteğe otomatik olarak Token ekler
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 Hatalarını global olarak yakalar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert('Hata', 'Oturum süreniz doldu veya giriş başarısız.');
    }
    return Promise.reject(error);
  }
);

export default api;