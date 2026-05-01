const Comment = require('../models/Comment');

const getCommentsByPostId = async (postId) => {
    // Yorumları tarihe göre yeniden eskiye sıralayarak getirir
    return await Comment.find({ postId }).sort({ createdAt: -1 });
};

const createComment = async (postId, authorId, text) => {
    const newComment = new Comment({
        postId,
        authorId,
        text
    });
    return await newComment.save();
};

// Yorum güncelle (sadece text alanı)
const updateComment = async (commentId, text) => {
    return await Comment.findByIdAndUpdate(
        commentId,
        { text },
        { new: true, runValidators: true }
    );
};

// Yorum sil
const deleteComment = async (commentId) => {
    return await Comment.findByIdAndDelete(commentId);
};

module.exports = {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
};