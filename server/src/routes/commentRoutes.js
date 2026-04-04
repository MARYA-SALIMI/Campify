const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET: Yorumları getir (/api/comments/:postId)
router.get('/:postId', commentController.getComments);

// POST: Yeni yorum ekle (/api/comments/:postId)
router.post('/:postId', commentController.addComment);

module.exports = router;