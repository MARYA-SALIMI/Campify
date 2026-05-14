const User = require('../models/User');
const { getCache, setCache, deleteCache } = require('../config/redis');

// Kullanici profili getir
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const cacheKey = `users:${userId}`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      console.log(`[UserController] Cache HIT - ${cacheKey}`);
      return res.status(200).json(cachedUser);
    }

    console.log(`[UserController] Cache MISS - ${cacheKey}`);
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Kullanici bulunamadi.' });

    // Sonucu cachele (120 saniye)
    await setCache(cacheKey, user, 120);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanici profili guncelle
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');

    // Cache temizle
    await deleteCache(`users:${userId}`);
    await deleteCache('users:all');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Kullanici hesabini sil
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);

    // Cache temizle
    await deleteCache(`users:${userId}`);
    await deleteCache('users:all');

    res.status(200).json({ message: 'Hesap basariyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanici ara (isim ile)
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Arama terimi gerekli.' });

    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ]
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
