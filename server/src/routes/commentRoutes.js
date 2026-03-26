const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// SIRALAMAYA VE İSİMLERE DİKKAT:
router.post('/posts/:postId/comments', commentController.addComment);
router.get('/posts/:postId/comments', commentController.listComments);
router.put('/comments/:commentId', commentController.updateComment);
router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;