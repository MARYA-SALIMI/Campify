const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getPosts);           // GET -> /api/posts (Hepsini getir)
router.post('/', postController.createPost);        // POST -> /api/posts (Yeni ekle)
router.put('/:id', postController.updatePost);      // PUT -> /api/posts/ID (Güncelle)
router.delete('/:id', postController.deletePost);   // DELETE -> /api/posts/ID (Sil)

module.exports = router;