const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 1. Belirli bir Post'a ait tüm yorumları getir (GET -> /api/comments/:postId)
router.get('/:postId', commentController.listComments);

// 2. Yeni yorum ekle (POST -> /api/comments/:postId)
router.post('/:postId', commentController.addComment);

// 3. Yorumu güncelle (PUT -> /api/comments/:commentId)
router.put('/:commentId', commentController.updateComment);

// 4. Yorumu sil (DELETE -> /api/comments/:commentId)
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;