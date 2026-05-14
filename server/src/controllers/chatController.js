const Chat = require('../models/Chat');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User'); // Populasyon için gerekebilir
const { publishMessageSent } = require('../services/messageQueue');

// Mesaj Oluştur
exports.createMessage = async (req, res) => {
    try {
        const newMessage = new Chat(req.body);
        const savedMessage = await newMessage.save();
        
        // ChatRoom güncelleniyor (son mesaj)
        if (req.body.chatId) {
            await ChatRoom.findByIdAndUpdate(req.body.chatId, {
                'lastMessage.content': req.body.text,
                'lastMessage.createdAt': savedMessage.createdAt
            });
        }

        // RabbitMQ event yayinla
        await publishMessageSent(savedMessage);
        
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
        
        // Oda bilgisini (yazıyor durumu için) de çekelim
        const room = await ChatRoom.findById(chatId);
        
        res.status(200).json({
            messages,
            typingUsers: room?.typingUsers || []
        });
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

// Mesaj Güncelle (Düzenle)
exports.updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        
        const updatedMessage = await Chat.findByIdAndUpdate(messageId, {
            text,
            isEdited: true
        }, { new: true });
        
        // Eğer düzenlenen mesaj son mesaj ise ChatRoom'u da güncelle
        if (updatedMessage) {
            await ChatRoom.findOneAndUpdate(
                { _id: updatedMessage.chatId, 'lastMessage.createdAt': updatedMessage.createdAt },
                { 'lastMessage.content': text }
            );
        }
        
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mesaj Beğen / Beğeniyi Kaldır
exports.toggleLikeMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId; // Middleware'den geliyor
        
        const message = await Chat.findById(messageId);
        if (!message) return res.status(404).json({ message: "Mesaj bulunamadı." });
        
        const likeIndex = message.likes.indexOf(userId);
        if (likeIndex === -1) {
            message.likes.push(userId);
        } else {
            message.likes.splice(likeIndex, 1);
        }
        
        await message.save();
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mesajları Okundu Olarak İşaretle
exports.markAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.userId;
        
        // Bu odadaki, başkasının gönderdiği ve henüz okunmamış mesajları okundu yap
        await Chat.updateMany(
            { chatId, from: { $ne: userId }, isSeen: false },
            { isSeen: true }
        );
        
        res.status(200).json({ message: "Okundu olarak işaretlendi." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Yazıyor Durumunu Güncelle
exports.setTypingStatus = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { isTyping } = req.body;
        const userId = req.userId;
        
        const update = isTyping 
            ? { $addToSet: { typingUsers: userId } }
            : { $pull: { typingUsers: userId } };
            
        const room = await ChatRoom.findByIdAndUpdate(chatId, update, { new: true });
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Sohbet Odası Oluştur
exports.createChatRoom = async (req, res) => {
    try {
        const { participants, name } = req.body;
        
        // Eğer 2 kişilik bir sohbet ise, daha önce var mı diye kontrol edilebilir
        if (participants.length === 2) {
            const existingRoom = await ChatRoom.findOne({
                participants: { $all: participants, $size: 2 }
            });
            if (existingRoom) {
                return res.status(200).json(existingRoom); // Varsa olanı dön
            }
        }
        
        const newRoom = new ChatRoom({ participants, name });
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Kullanıcının Sohbet Odalarını Getir
exports.getChatRooms = async (req, res) => {
    try {
        // userId middleware'den gelecek
        const rooms = await ChatRoom.find({ participants: req.userId }).sort({ updatedAt: -1 });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
