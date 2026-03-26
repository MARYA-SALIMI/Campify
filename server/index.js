const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Gelen JSON formatındaki istekleri okuyabilmek için (Postman'den veri gönderirken çok önemli)
app.use(express.json());

// MongoDB Veritabanı Bağlantısı (Kendi bilgisayarındaki yerel veritabanına bağlanır)
mongoose.connect('mongodb://127.0.0.1:27017/campify')
    .then(() => console.log('MongoDB veritabanına başarıyla bağlanıldı! 🚀'))
    .catch((err) => console.log('MongoDB bağlantı hatası:', err));


// --- İŞTE SORDUĞUN KISIM BURASI ---
// Yorum rotamızı (garsonumuzu) uygulamaya tanıtıyoruz
const commentRoutes = require('./src/routes/commentRoutes');
app.use('/api', commentRoutes);
const chatRoutes = require('./src/routes/chatRoutes');
app.use('/api', chatRoutes); 
// ----------------------------------


// Sunucuyu Ayağa Kaldırma
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Campify sunucusu http://localhost:${PORT} adresinde çalışıyor...`);
});