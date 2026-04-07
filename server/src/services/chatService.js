const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const createChat = async (participants) => {
  const newChat = new Chat({ participants });
  return await newChat.save();
};

const getUserChats = async (userId) => {
  return await Chat.find({
    participants: new mongoose.Types.ObjectId(userId)
  }).sort({ updatedAt: -1 });
};

const sendMessage = async (chatId, senderId, content) => {
  const newMessage = new Message({ chatId, senderId, content });
  const savedMessage = await newMessage.save();

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: savedMessage._id
  });

  return savedMessage;
};

module.exports = {
  createChat,
  getUserChats,
  sendMessage
};