const Chat = require('../models/Chat');

// Mesaj Oluştur
exports.createMessage = async (req, res) => {
    try {
        const newMessage = new Chat(req.body);
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mesajları Getir (chatId'ye göre filtrele)
exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.query;
        const messages = await Chat.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mesaj Sil
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Chat.findByIdAndDelete(messageId);
        res.status(200).json({ message: "Mesaj başarıyla silindi." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};