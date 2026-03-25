const postService = require('../services/postService');

// 1. Gönderi Oluşturma (POST)
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user ? req.user.id : "60d0fe4f5311236168a109ca"; // Geçici test ID'si
    
    const savedPost = await postService.createPost({ userId, title, content, tags });
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ code: "VALIDATION_ERROR", message: error.message });
  }
};

// 2. Gönderileri Listeleme (GET)
exports.getPosts = async (req, res) => {
  try {
    // URL'den sayfa ve limit değerlerini alıyoruz (Örn: ?page=1&limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId;

    const posts = await postService.getAllPosts(page, limit, userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 3. Gönderi Güncelleme (PUT)
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    const updatedPost = await postService.updatePost(postId, { title, content, tags });
    
    if (!updatedPost) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Gönderi bulunamadı" });
    }
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 4. Gönderi Silme (DELETE)
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deletedPost = await postService.deletePost(postId);

    if (!deletedPost) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Gönderi bulunamadı" });
    }

    res.status(204).send(); // Başarılı silmede içerik dönmez
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};