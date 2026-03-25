const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // .env dosyasındaki adrese bağlanmayı dener
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB veritabanı bağlantısı başarılı! 🚀');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1); // Hata varsa uygulamayı durdur
  }
};

module.exports = connectDB;