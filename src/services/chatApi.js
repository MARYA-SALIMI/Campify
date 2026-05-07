import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatApi = axios.create({
  baseURL: 'https://campify-melisa.vercel.app',
  headers: { 'Content-Type': 'application/json' },
});

chatApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default chatApi;