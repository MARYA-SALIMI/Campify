const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
// Projenizde auth işlemi için kullanılan middleware'i buraya çağırmalısınız. 
// İsmi genelde auth.js veya verifyToken.js olur. Ben örnek olarak 'authMiddleware' yazdım.
// const authMiddleware = require('../middlewares/authMiddleware'); 

// Yorum Ekleme (POST /posts/{postId}/comments)
// router.post('/posts/:postId/comments', authMiddleware, commentController.addComment);
router.post('/posts/:postId/comments', commentController.addComment); // Şimdilik auth olmadan test etmek için böyle bırakabiliriz

module.exports = router;