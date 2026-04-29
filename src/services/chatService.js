import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// ── Yardımcı: Her istekte güncel token'ı AsyncStorage'dan çeker ──────────────
const authConfig = async () => {
    const token = await AsyncStorage.getItem('token');
    return token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
};

export const getChats = async () => {
    const response = await api.get('/chats', await authConfig());
    return response.data;
};

export const getChatById = async (chatId) => {
    const response = await api.get(`/chats/${chatId}`, await authConfig());
    return response.data;
};

export const getMessages = async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`, await authConfig());
    return response.data;
};

export const sendMessage = async (chatId, messageData) => {
    const response = await api.post(`/chats/${chatId}/messages`, messageData, await authConfig());
    return response.data;
};

export const createChat = async (participantId) => {
    const response = await api.post('/chats', { participantId }, await authConfig());
    return response.data;
};

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/chats/${chatId}`, await authConfig());
    return response.data;
};