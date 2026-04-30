const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// ✅ ÇÖZÜM: authMiddleware default olarak export edildiği için süslü parantez kaldırıldı.
const authMiddleware = require('../middleware/authMiddleware');

// API Uç Noktaları (Endpoints)
router.post('/', authMiddleware, postController.createPost);    // ✅ Korumalı: Sadece giriş yapanlar gönderi atabilir
router.get('/', postController.getPosts);                       // Herkese açık: Anasayfa akışı
router.put('/:postId', authMiddleware, postController.updatePost);    // ✅ Korumalı: Sadece giriş yapanlar güncelleyebilir
router.delete('/:postId', authMiddleware, postController.deletePost); // ✅ Korumalı: Sadece giriş yapanlar silebilir

module.exports = router;