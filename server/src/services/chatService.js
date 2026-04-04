const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getUserChats = async (userId) => {
  return await Chat.find({
    participants: new mongoose.Types.ObjectId(userId)
  }).sort({ updatedAt: -1 });
};

const Chat = require('../models/Chat');
const Message = require('../models/Message');

// 1. Yeni sohbet oluşturma (Mesaj atabilmemiz için bir odaya ihtiyacımız var)
exports.createChat = async (participants) => {
  const newChat = new Chat({ participants });
  return await newChat.save();
};


// 3. Belirli bir sohbete mesaj gönderme (POST /chats/:chatId/messages)
exports.sendMessage = async (chatId, senderId, content) => {
  // A. Önce mesajı oluştur ve kaydet
  const newMessage = new Message({ chatId, senderId, content });
  const savedMessage = await newMessage.save();

  // B. Mesaj başarıyla kaydedilirse, ilgili sohbetin 'lastMessage' bilgisini güncelle
  await Chat.findByIdAndUpdate(chatId, { lastMessage: savedMessage._id });

  return savedMessage;
};