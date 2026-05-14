const Post = require('../models/Post');
const { getCache, setCache, deleteCache } = require('../config/redis');
const { publishPostCreated } = require('../services/messageQueue');

// Tüm Postları Listele (Redis Cache ile)
exports.getPosts = async (req, res) => {
    try {
        // Onbellekten kontrol et
        const cacheKey = 'posts:all';
        const cachedPosts = await getCache(cacheKey);

        if (cachedPosts) {
            console.log('[PostController] Cache HIT - posts:all');
            return res.status(200).json(cachedPosts);
        }

        console.log('[PostController] Cache MISS - posts:all');
        const posts = await Post.find()
            .populate('authorId', 'firstName lastName')
            .sort({ createdAt: -1 }); // En yeni en üstte

        // Sonucu cachele (60 saniye)
        await setCache(cacheKey, posts, 60);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Yeni Post Oluştur
exports.createPost = async (req, res) => {
    try {
        const { title, content, authorId, authorName } = req.body;
        const newPost = new Post({ title, content, authorId, authorName });
        const savedPost = await newPost.save();

        // Cache temizle
        await deleteCache('posts:*');

        // RabbitMQ event yayinla
        await publishPostCreated(savedPost);

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

        // Cache temizle
        await deleteCache('posts:*');

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Postu Sil
exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        // Cache temizle (post ve ilgili yorumlar)
        await deleteCache('posts:*');
        await deleteCache('comments:*');

        res.status(200).json({ message: "Post başarıyla silindi." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
