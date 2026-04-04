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
        const { authorId, text } = req.body; // React'ten gelen veriler

        // Şemadaki zorunlu alanların kontrolü
        if (!authorId || !text) {
            return res.status(400).json({ mesaj: "Yazar ID ve metin (text) zorunludur." });
        }

        const newComment = await commentService.createComment(postId, authorId, text);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ mesaj: "Yorum kaydedilemedi", hata: error.message });
    }
};

module.exports = {
    getComments,
    addComment
};