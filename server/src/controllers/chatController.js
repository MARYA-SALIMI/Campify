const Message = require('../models/Message');
const Chat = require('../models/Chat'); // Chat modelimizi içeri aktardık

// 1. Sohbet Kanalı Oluşturma (GERÇEK VERİTABANI BAĞLANTISI)
exports.createChat = async (req, res) => {
  try {
    const { participants } = req.body;

    // Eğer katılımcı gönderilmemişse uyarı ver
    if (!participants || participants.length === 0) {
      return res.status(400).json({ success: false, message: "Lütfen katılımcı (participants) ekleyin." });
    }

    // Yeni sohbet odasını oluştur ve kaydet
    const newChat = new Chat({ participants: participants });
    await newChat.save();

    res.status(201).json({
      success: true,
      message: "Sohbet başarıyla oluşturuldu! 🎉",
      data: newChat
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Hata oluştu: " + error.message });
  }
};

// 2. Sohbetleri Listeleme ( 2. GEREKSİNİM)
exports.getChats = async (req, res) => {
  try {
    // Güvenlik kilidi: Sistemde giriş yapmış biri yoksa sahte ID kullanıyoruz
    const userId = req.user?.id || "609d201584c6883e08f25b66";

    // Veritabanında "participants" dizisi içinde bizim userId'mizi barındıran tüm sohbetleri bul
    const chats = await Chat.find({ participants: userId })
      .populate('lastMessage') // Son mesajın sadece ID'sini değil, içeriğini de getir
      .sort({ updatedAt: -1 }); // En yeni mesajlaşılan sohbet en üstte çıksın

    res.status(200).json({
      success: true,
      count: chats.length,
      message: "Sohbetler başarıyla listelendi",
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sohbetler getirilirken bir hata oluştu: " + error.message
    });
  }
};

// 3. Mesaj Gönderme (1. GEREKSİNİM - BAŞARIYLA TAMAMLANDI)
exports.sendMessage = async (req, res) => {
  try {
    // chatRoutes'daki :chatId parametresini alıyoruz
    const { chatId } = req.params;
    const { content } = req.body;

    // Güvenlik kilidi: Test edebilmek için 24 karakterli sahte bir ObjectId veriyoruz
    const senderId = req.user?.id || "609d201584c6883e08f25b66";

    const newMessage = new Message({
      chatId: chatId,
      senderId: senderId,
      content: content
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: "Mesaj başarıyla kaydedildi!", data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, code: "BAD_REQUEST", message: error.message });
  }
};