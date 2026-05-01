import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

export default chatApi;