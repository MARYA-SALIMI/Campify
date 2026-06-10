const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// GET: Yorumları getir (/api/comments/:postId)
router.get('/:postId', commentController.getComments);

// POST: Yeni yorum ekle (/api/comments/:postId)
router.post('/:postId', commentController.addComment);

// PUT: Yorum güncelle (/api/comments/:commentId) — Sadece yorum sahibi
router.put('/:commentId', authMiddleware, commentController.updateComment);

// DELETE: Yorum sil (/api/comments/:commentId) — Yorum sahibi veya gönderi sahibi
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

// POST: Yorum beğen (/api/comments/:commentId/like)
router.post('/:commentId/like', commentController.toggleLikeComment);

module.exports = router;