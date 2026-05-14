const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET: Yorumları getir (/api/comments/:postId)
router.get('/:postId', commentController.getComments);

// POST: Yeni yorum ekle (/api/comments/:postId)
router.post('/:postId', commentController.addComment);

// PUT: Yorum güncelle (/api/comments/:commentId)
router.put('/:commentId', commentController.updateComment);

// DELETE: Yorum sil (/api/comments/:commentId)
router.delete('/:commentId', commentController.deleteComment);

// POST: Yorum beğen (/api/comments/:commentId/like)
router.post('/:commentId/like', commentController.toggleLikeComment);

module.exports = router;