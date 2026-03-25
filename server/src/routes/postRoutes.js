const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// API Uç Noktaları (Endpoints)
router.post('/', postController.createPost);             // Yeni gönderi
router.get('/', postController.getPosts);                // Tüm gönderileri listele
router.put('/:postId', postController.updatePost);       // Belirli bir gönderiyi güncelle
router.delete('/:postId', postController.deletePost);    // Belirli bir gönderiyi sil

module.exports = router;