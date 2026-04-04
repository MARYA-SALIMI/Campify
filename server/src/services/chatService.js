const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// 1. Yeni sohbet oluşturma
exports.createChat = async (participants) => {
  const newChat = new Chat({ participants });
  return await newChat.save();
};

// 2. Kullanıcının sohbetlerini listeleme
exports.getUserChats = async (userId) => {
  return await Chat.find({
    participants: new mongoose.Types.ObjectId(userId)
  }).sort({ updatedAt: -1 });
};

// 3. Mesaj gönderme
exports.sendMessage = async (chatId, senderId, content) => {
  const newMessage = new Message({ chatId, senderId, content });
  const savedMessage = await newMessage.save();

  await Chat.findByIdAndUpdate(chatId, { lastMessage: savedMessage._id });

  return savedMessage;
};