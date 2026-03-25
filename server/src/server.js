require('dotenv').config(); // .env dosyasını okumak için gerekli modül
const app = require('./app');
const connectDB = require('./config/db');

// Önce veritabanına bağlanıyoruz
connectDB();

// .env dosyasından portu alıyoruz, bulamazsa 3000'i kullanıyor
const PORT = process.env.PORT || 3000;

// Sunucuyu dinlemeye (çalıştırmaya) başlıyoruz
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor... 🌐`);
});