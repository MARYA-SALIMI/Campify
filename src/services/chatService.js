import api from './api';
import chatApi from './chatApi';

// Backend route: /api/chat
const BASE = '/api/chat';

// Sohbet listesini getir (GET /api/chat/rooms)
export const getChats = async () => {
    const response = await chatApi.get(`${BASE}/rooms`);
    return response.data;
};

// Mesajları getir (GET /api/chat?chatId=XXX)
export const getMessages = async (chatId) => {
    const response = await chatApi.get(BASE, {
        params: { chatId }
    });
    return response.data;
};

// Mesaj / sohbet oluştur (POST /api/chat)
export const sendMessage = async (chatId, messageData) => {
    const payload = {
        chatId: chatId,
        text: messageData.content,
        from: messageData.senderId
    };
    const response = await chatApi.post(BASE, payload);
    return response.data;
};

// Yeni sohbet başlat (POST /api/chat/room)
export const createChat = async (participants, name = '') => {
    // participants: ID'lerden oluşan bir dizi, örn: ['ID1', 'ID2']
    const response = await chatApi.post(`${BASE}/room`, { participants, name });
    return response.data;
};

// Mesaj sil (DELETE /api/chat/:messageId)
export const deleteMessage = async (chatId, messageId) => {
    if (!messageId) throw new Error('messageId eksik');
    const response = await chatApi.delete(`${BASE}/${messageId}`);
    return response.data;
};

// Mesaj düzenle (PUT /api/chat/:messageId)
export const editMessage = async (messageId, newText) => {
    const response = await chatApi.put(`${BASE}/${messageId}`, { text: newText });
    return response.data;
};

// Mesaj beğen / beğeniyi kaldır (POST /api/chat/:messageId/like)
export const toggleLikeMessage = async (messageId) => {
    const response = await chatApi.post(`${BASE}/${messageId}/like`);
    return response.data;
};

// Mesajları okundu yap (POST /api/chat/rooms/:chatId/read)
export const markAsRead = async (chatId) => {
    const response = await chatApi.post(`${BASE}/rooms/${chatId}/read`);
    return response.data;
};

// Yazıyor durumunu bildir (POST /chat/rooms/:chatId/typing)
export const setTypingStatus = async (chatId, isTyping) => {
    const response = await chatApi.post(`${BASE}/rooms/${chatId}/typing`, { isTyping });
    return response.data;
};

// Gerçek kullanıcı arama API'si
export const searchUsers = async (query) => {
    if (!query || query.trim() === '') return [];
    try {
        const response = await chatApi.get(`/api/user/search`, { params: { q: query } });
        return response.data;
    } catch (error) {
        console.error("Arama hatası:", error);
        return [];
    }
};