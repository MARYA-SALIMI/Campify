const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Veritabanı Bağlantısı
mongoose.connect('mongodb+srv://melisa:365214789@cluster0.gi14amm.mongodb.net/?appName=Cluster0')
    .then(() => console.log('MongoDB veritabanına başarıyla bağlanıldı! 🚀'))
    .catch((err) => console.log('MongoDB bağlantı hatası:', err));

// --- ROTALARI BURADA ÇAĞIRIYORUZ ---
// Eğer hata verirse aşağıdaki satırın başındaki ./ kısmını kontrol et
const commentRoutes = require('./src/routes/commentRoutes');
app.use('/api', commentRoutes);

const chatRoutes = require('./src/routes/chatRoutes');
app.use('/api', chatRoutes);
// ----------------------------------

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Campify sunucusu http://localhost:${PORT} adresinde çalışıyor...`);
});