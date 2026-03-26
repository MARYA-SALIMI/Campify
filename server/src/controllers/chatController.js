const Chat = require('../models/Chat');
const Message = require('../models/Message');

// 1. Sohbet Oluşturma (POST /chats)
exports.createChat = async (req, res) => {
    try {
        const { receiverId, initialMessage } = req.body;
        // Auth eklendiğinde giriş yapan kullanıcıyı alacağız: const senderId = req.user.id;
        
        // Şimdilik test için sahte bir gönderici ID'si oluşturuyoruz
        const mongoose = require('mongoose');
        const senderId = new mongoose.Types.ObjectId(); 

        // Sohbet kanalını oluştur
        const newChat = new Chat({
            participants: [senderId, receiverId]
        });
        await newChat.save();

        // İlk mesajı oluştur ve kaydet
        if (initialMessage) {
            const newMessage = new Message({
                chatId: newChat._id,
                senderId: senderId,
                content: initialMessage
            });
            await newMessage.save();
        }

        res.status(201).json({ message: "Sohbet kanalı oluşturuldu." });
    } catch (error) {
        res.status(400).json({ code: "BAD_REQUEST", message: "Geçersiz istek" });
    }
};

// 2. Mesaj Silme (DELETE /messages/{messageId})
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ code: "NOT_FOUND", message: "Mesaj bulunamadı" });
        }

        res.status(204).send(); // Başarılı silme
    } catch (error) {
        res.status(500).json({ code: "SERVER_ERROR", message: "Silme işlemi başarısız" });
    }
};