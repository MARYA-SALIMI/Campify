const User = require('../models/User');
const redisClient = require('../utils/redisClient'); // oluşturduğumuz dosya

// 1. Profil Görüntüleme (OKUMA)
exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Önce Redis'e sor: "Bu kullanıcı bende var mı?"
    const cachedUser = await redisClient.get(`user:${userId}`);
    
    if (cachedUser) {
      console.log("🚀 Veri Redis'ten (Cache) getirildi!");
      return res.status(200).json(JSON.parse(cachedUser));
    }

    // Redis'te yoksa MongoDB'ye git
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ code: "NOT_FOUND", message: "İstenen kaynak bulunamadı" });

    const userProfile = {
      id: user._id,
      ad: user.firstName,
      soyad: user.lastName,
      email: user.email,
      bolum: user.department || "",
      ilgi_alanlari: user.interests || [],
      yetenekler: user.skills || []
    };

    // MongoDB'den aldığın veriyi Redis'e kaydet (Örn: 1 saatliğine)
    await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(userProfile));

    console.log("💾 Veri MongoDB'den getirildi ve Redis'e kaydedildi.");
    res.status(200).json(userProfile);
  } catch (err) {
    next(err);
  }
};

// 2. Profil Güncelleme (GÜNCELLEME)
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { returnDocument: "after" }
    ).select("-password");

    // KRİTİK: Veri değiştiği için Redis'teki eski veriyi silmeliyiz!
    await redisClient.del(`user:${userId}`);
    console.log("🗑️ Güncelleme oldu, Redis cache temizlendi.");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Hesap Silme (SİLME)
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);

    // KRİTİK: Kullanıcı silindiği için Redis'teki kaydı da uçur!
    await redisClient.del(`user:${userId}`);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};