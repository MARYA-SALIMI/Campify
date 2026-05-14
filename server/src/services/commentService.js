const Comment = require('../models/Comment');
const { getCache, setCache, deleteCache } = require('../config/redis');
const { publishCommentCreated } = require('../services/messageQueue');

const getCommentsByPostId = async (postId) => {
    // Onbellekten kontrol et
    const cacheKey = `comments:post:${postId}`;
    const cachedComments = await getCache(cacheKey);

    if (cachedComments) {
        console.log(`[CommentService] Cache HIT - ${cacheKey}`);
        return cachedComments;
    }

    console.log(`[CommentService] Cache MISS - ${cacheKey}`);
    // Yorumları tarihe göre yeniden eskiye sıralayarak getirir
    const comments = await Comment.find({ postId })
        .populate('authorId', 'firstName lastName')
        .sort({ createdAt: -1 });

    // Sonucu cachele (30 saniye)
    await setCache(cacheKey, comments, 30);

    return comments;
};

const createComment = async (postId, authorId, text, authorName, parentId, replyToName) => {
    const newComment = new Comment({
        postId,
        authorId,
        text,
        authorName,
        parentId,
        replyToName
    });
    const savedComment = await newComment.save();

    // Cache temizle
    await deleteCache(`comments:post:${postId}`);

    // RabbitMQ event yayinla
    await publishCommentCreated(savedComment);

    return savedComment;
};

const toggleLikeComment = async (commentId, userId, userName) => {
    const comment = await Comment.findById(commentId);
    if (!comment) return null;

    const index = comment.likes.findIndex(l => l.userId === userId);
    if (index === -1) {
        comment.likes.push({ userId, userName });
    } else {
        comment.likes.splice(index, 1);
    }

    const updatedComment = await comment.save();

    // Cache temizle
    await deleteCache(`comments:post:${comment.postId}`);

    return updatedComment;
};

// Yorum güncelle (sadece text alanı)
const updateComment = async (commentId, text) => {
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { text },
        { new: true, runValidators: true }
    );

    // Cache temizle
    if (updatedComment) {
        await deleteCache(`comments:post:${updatedComment.postId}`);
    }

    return updatedComment;
};

// Yorum sil
const deleteComment = async (commentId) => {
    const comment = await Comment.findById(commentId);
    if (comment) {
        await deleteCache(`comments:post:${comment.postId}`);
    }
    return await Comment.findByIdAndDelete(commentId);
};

module.exports = {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
    toggleLikeComment
};
