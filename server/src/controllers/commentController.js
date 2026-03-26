const Comment = require('../models/Comment');



// 1. Ekleme
exports.addComment = async (req, res) => {
    try {
        const newComment = new Comment({ 
            postId: req.params.postId, 
            text: req.body.text,
            authorId: req.body.authorId // İŞTE GÖZDEN KAÇAN O SİHİRLİ SATIR! 🚀
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) { 
        res.status(400).json(err); 
    }
};

// 2. Listeleme
exports.listComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
    } catch (err) { res.status(500).json(err); }
};

// 3. Güncelleme
exports.updateComment = async (req, res) => {
    try {
        const updated = await Comment.findByIdAndUpdate(req.params.commentId, { text: req.body.text }, { new: true });
        res.status(200).json(updated);
    } catch (err) { res.status(400).json(err); }
};

// 4. Silme
exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(204).send();
    } catch (err) { res.status(400).json(err); }
};