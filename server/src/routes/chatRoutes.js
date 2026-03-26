const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chats', chatController.createChat);
router.delete('/messages/:messageId', chatController.deleteMessage);

module.exports = router;