const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// API Uç Noktaları (Endpoints)
router.post('/', chatController.createChat);             // Sohbet kanalı oluştur
router.get('/', chatController.getChats);                // Sohbetleri listele
router.post('/:chatId/messages', chatController.sendMessage); // Mesaj gönder

module.exports = router;