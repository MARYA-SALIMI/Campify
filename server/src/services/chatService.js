const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.createChat = async (participants) => {
  const newChat = new Chat({ participants });
  return await newChat.save();
};

exports.getUserChats = async (userId) => {
  return await Chat.find({
    participants: new mongoose.Types.ObjectId(userId)
  }).sort({ updatedAt: -1 });
};

exports.sendMessage = async (chatId, senderId, content) => {
  const newMessage = new Message({ chatId, senderId, content });
  const savedMessage = await newMessage.save();

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: savedMessage._id
  });

  return savedMessage;
};

// ── YENİ: Sohbet mesajlarını eskiden yeniye getir ────────────────────────────
exports.getMessages = async (chatId) => {
  return await Message.find({ chatId }).sort({ createdAt: 1 });
};