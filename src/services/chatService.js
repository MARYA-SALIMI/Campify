import chatApi from './chatApi';

const BASE = '/chats';

export const getChats = async () => {
    const response = await chatApi.get(BASE);
    return response.data;
};

export const getChatById = async (chatId) => {
    if (!chatId) throw new Error('getChatById: chatId undefined');
    const response = await chatApi.get(`${BASE}/${chatId}`);
    return response.data;
};

export const getMessages = async (chatId) => {
    console.log('📢 [chatService] getMessages çağrıldı, gelen chatId:', chatId);
    if (!chatId) throw new Error('getMessages: chatId undefined');
    const endpoint = `${BASE}/${chatId}/messages`;
    console.log('📢 [chatService] İstek atılan tam path:', endpoint);
    const response = await chatApi.get(endpoint);
    return response.data;
};

export const sendMessage = async (chatId, messageData) => {
    if (!chatId) throw new Error('sendMessage: chatId undefined');
    const response = await chatApi.post(`${BASE}/${chatId}/messages`, messageData);
    return response.data;
};

export const createChat = async (participantId) => {
    const response = await chatApi.post(BASE, { participantId });
    return response.data;
};

export const deleteChat = async (chatId) => {
    if (!chatId) throw new Error('deleteChat: chatId undefined');
    const response = await chatApi.delete(`${BASE}/${chatId}`);
    return response.data;
};