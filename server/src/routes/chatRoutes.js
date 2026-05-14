const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// 1. Yeni sohbet/mesaj oluştur (POST -> /api/chat)
router.post('/', chatController.createMessage);

// 2. Tüm mesajları listele (GET -> /api/chat)
router.get('/', chatController.getMessages);

// 3. Mesaj sil (DELETE -> /api/chat/:messageId)
router.delete('/:messageId', chatController.deleteMessage);

// 4. Mesaj düzenle (PUT -> /api/chat/:messageId)
router.put('/:messageId', authMiddleware, chatController.updateMessage);

// 5. Mesaj beğen (POST -> /api/chat/:messageId/like)
router.post('/:messageId/like', authMiddleware, chatController.toggleLikeMessage);

// 4. Sohbet Odası Oluştur (POST -> /api/chat/room)
router.post('/room', authMiddleware, chatController.createChatRoom);

// 5. Kullanıcının Sohbet Odalarını Listele (GET -> /api/chat/rooms)
router.get('/rooms', authMiddleware, chatController.getChatRooms);

// 6. Mesajları okundu yap (POST -> /api/chat/rooms/:chatId/read)
router.post('/rooms/:chatId/read', authMiddleware, chatController.markAsRead);

// 7. Yazıyor durumunu bildir (POST -> /api/chat/rooms/:chatId/typing)
router.post('/rooms/:chatId/typing', authMiddleware, chatController.setTypingStatus);

module.exports = router;