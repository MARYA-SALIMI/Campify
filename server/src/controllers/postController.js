const Post = require('../models/Post');

// Tüm Postları Listele
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // En yeni en üstte
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Yeni Post Oluştur (Zaten yazmıştık)
exports.createPost = async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        const newPost = new Post({ title, content, authorId });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Tek Bir Postu Güncelle
exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Postu Sil
exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post başarıyla silindi." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};