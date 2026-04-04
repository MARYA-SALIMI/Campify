const Chat = require('../models/Chat');
const Message = require('../models/Message');

// 1. Yeni sohbet oluşturma (Mesaj atabilmemiz için bir odaya ihtiyacımız var)
exports.createChat = async (participants) => {
  const newChat = new Chat({ participants });
  return await newChat.save();
};

// 2. Kullanıcının dahil olduğu tüm sohbetleri listeleme (GET /chats)
exports.getUserChats = async (userId) => {
  // İçinde bu kullanıcının ID'si geçen tüm sohbetleri bul
  // İçinde bu kullanıcının ID'si geçen tüm sohbetleri bul
  return await Chat.find({ participants: userId })
    .sort({ updatedAt: -1 }); // En son mesajlaşılanlar en üstte çıksın
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