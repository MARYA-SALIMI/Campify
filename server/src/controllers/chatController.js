const chatService = require('../services/chatService');

exports.createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca";

    const targetId = receiverId || "60d0fe4f5311236168a109cb";

    const chat = await chatService.createChat([userId, targetId]);
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca";
    const chats = await chatService.getUserChats(userId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca";

    const message = await chatService.sendMessage(chatId, userId, content);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ code: "VALIDATION_ERROR", message: error.message });
  }
};

// ── YENİ: GET /chats/:chatId/messages ───────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await chatService.getMessages(chatId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};