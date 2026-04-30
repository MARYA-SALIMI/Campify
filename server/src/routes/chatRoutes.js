const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.createChat);
router.get('/', chatController.getChats);
router.post('/:chatId/messages', chatController.sendMessage);
router.get('/:chatId/messages', chatController.getMessages); // ── YENİ

module.exports = router;