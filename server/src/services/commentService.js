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

module.exports = {
    getCommentsByPostId,
    createComment
};