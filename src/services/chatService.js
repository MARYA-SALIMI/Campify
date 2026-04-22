import api from './api';

export const getChats = async () => {
    const response = await api.get('/chats');
    return response.data;
};

export const getChatById = async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
};

export const getMessages = async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
};

export const sendMessage = async (chatId, messageData) => {
    const response = await api.post(`/chats/${chatId}/messages`, messageData);
    return response.data;
};

export const createChat = async (participantId) => {
    const response = await api.post('/chats', { participantId });
    return response.data;
};

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
};