const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// 1. Yeni sohbet/mesaj oluştur (POST -> /api/chat)
router.post('/', chatController.createMessage);

// 2. Tüm mesajları listele (GET -> /api/chat)
router.get('/', chatController.getMessages);

// 3. Mesaj sil (DELETE -> /api/chat/:messageId)
router.delete('/:messageId', chatController.deleteMessage);

module.exports = router;