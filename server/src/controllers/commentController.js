const commentService = require('../services/commentService');

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
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ mesaj: "Yeni metin (text) zorunludur." });
        }

        const updated = await commentService.updateComment(commentId, text);
        if (!updated) {
            return res.status(404).json({ mesaj: "Yorum bulunamadı." });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ mesaj: "Yorum güncellenemedi", hata: error.message });
    }
};

// DELETE /api/comments/:commentId — Yorum sil
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const deleted = await commentService.deleteComment(commentId);
        if (!deleted) {
            return res.status(404).json({ mesaj: "Yorum bulunamadı." });
        }
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