const Chat = require('../models/Chat');
const Message = require('../models/Message');

// 1. Sohbet Oluşturma
exports.createChat = async (req, res) => {
    try {
        const { receiverId, initialMessage } = req.body;
        const newChat = new Chat({ participants: [receiverId] });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Mesaj Silme
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndDelete(messageId);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};