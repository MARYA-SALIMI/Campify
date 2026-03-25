const express = require('express');
const router = express.Router();

// Senin yazdığın gönderi (post) rotasını içeri aktarıyoruz
const postRoutes = require('./routes/postRoutes');

// '/posts' ile başlayan tüm istekleri senin garsonuna (postRoutes) yönlendiriyoruz
router.use('/posts', postRoutes);

// Not: Diğer takım arkadaşların kendi kısımlarını bitirdikçe buraya ekleme yapacaklar.
// Örn: router.use('/auth', authRoutes);

module.exports = router;
// ... önceki kodlar (postRoutes kısmı duracak)

const chatRoutes = require('./routes/chatRoutes'); // 1. Garsonu çağır
router.use('/chats', chatRoutes);                  // 2. /chats isteklerini ona yönlendir