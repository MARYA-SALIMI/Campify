const chatService = require('../services/chatService');

// 1. Test için sohbet odası oluşturma
exports.createChat = async (req, res) => {
  try {
    const { receiverId } = req.body; 
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca"; // Bizim sahte ID'miz
    
    // Eğer karşı tarafın ID'si girilmemişse test için rastgele bir ID uyduruyoruz
    const targetId = receiverId || "60d0fe4f5311236168a109cb"; 
    
    const chat = await chatService.createChat([userId, targetId]);
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 2. Kullanıcının sohbetlerini listeleme (Senin görevin)
exports.getChats = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca";
    const chats = await chatService.getUserChats(userId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 3. Mesaj gönderme (Senin görevin)
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params; // URL'den sohbet ID'sini alıyoruz
    const { content } = req.body;  // Gövdeden mesaj metnini alıyoruz
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca";

    const message = await chatService.sendMessage(chatId, userId, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ code: "VALIDATION_ERROR", message: error.message });
  }
};