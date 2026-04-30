import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const chatApi = axios.create({
    baseURL: 'https://campify-api-l1vf.onrender.com/api',
});

chatApi.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error reading token from AsyncStorage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
chatApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            Alert.alert('Hata', 'Oturum süreniz doldu veya yetkisiz işlem.');
        }
        return Promise.reject(error);
    }
);

export default chatApi;
