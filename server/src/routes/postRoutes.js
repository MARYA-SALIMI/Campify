const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// ✅ Marya'nın auth middleware'i — JWT'yi doğrulayıp req.user'ı doldurur
const authMiddleware = require('../middleware/authMiddleware');

// API Uç Noktaları (Endpoints)
router.post('/', authMiddleware, postController.createPost);  // ✅ Korumalı: token zorunlu
router.get('/', postController.getPosts);                     // Herkese açık
router.put('/:postId', postController.updatePost);            // Belirli bir gönderiyi güncelle
router.delete('/:postId', postController.deletePost);         // Belirli bir gönderiyi sil

module.exports = router;