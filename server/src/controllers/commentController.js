const commentService = require('../services/commentService');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPostId(postId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ mesaj: "Yorumlar getirilirken hata oluştu", hata: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { authorId, text, authorName, parentId, replyToName } = req.body; // React'ten gelen veriler

        // Şemadaki zorunlu alanların kontrolü
        if (!authorId || !text) {
            return res.status(400).json({ mesaj: "Yazar ID ve metin (text) zorunludur." });
        }

        const newComment = await commentService.createComment(postId, authorId, text, authorName, parentId, replyToName);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ mesaj: "Yorum kaydedilemedi", hata: error.message });
    }
};

const toggleLikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId, userName } = req.body;
        if (!userId) return res.status(400).json({ mesaj: "userId zorunludur." });

        const updated = await commentService.toggleLikeComment(commentId, userId, userName);
        if (!updated) return res.status(404).json({ mesaj: "Yorum bulunamadı." });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ mesaj: "Beğeni işlemi başarısız", hata: error.message });
    }
};

// PUT /api/comments/:commentId — Yorum güncelle
// Sadece yorumu yazan kullanıcı güncelleyebilir
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ mesaj: "Yeni metin (text) zorunludur." });
        }

        // Yetki kontrolü: Sadece yorumu yazan kullanıcı güncelleyebilir
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ mesaj: "Yorum bulunamadı." });
        }
        if (comment.authorId.toString() !== req.userId) {
            return res.status(403).json({ mesaj: "Bu yorumu güncelleme yetkiniz yok." });
        }

        const updated = await commentService.updateComment(commentId, text);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ mesaj: "Yorum güncellenemedi", hata: error.message });
    }
};

// DELETE /api/comments/:commentId — Yorum sil
// Yorumu yazan kullanıcı veya gönderi sahibi silebilir
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Yetki kontrolü: Yorumu yazan veya gönderi sahibi silebilir
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ mesaj: "Yorum bulunamadı." });
        }

        const isCommentAuthor = comment.authorId.toString() === req.userId;

        // Gönderi sahibi kontrolü
        let isPostOwner = false;
        try {
            const post = await Post.findById(comment.postId);
            if (post && post.authorId && post.authorId.toString() === req.userId) {
                isPostOwner = true;
            }
        } catch (err) {
            // Post bulunamazsa sadece yorum sahibi kontrolü geçerli
        }

        if (!isCommentAuthor && !isPostOwner) {
            return res.status(403).json({ mesaj: "Bu yorumu silme yetkiniz yok." });
        }

        const deleted = await commentService.deleteComment(commentId);
        res.status(200).json({ mesaj: "Yorum başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ mesaj: "Yorum silinemedi", hata: error.message });
    }
};

module.exports = {
    getComments,
    addComment,
    updateComment,
    deleteComment,
    toggleLikeComment
};