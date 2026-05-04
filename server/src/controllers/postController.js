const postService = require('../services/postService');
const { getChannel } = require('../config/rabbitmq');


// 1. Gönderi Oluşturma (POST)
exports.createPost = async (req, res) => {
  // authMiddleware req.user'ı doldurmuş olmalı; yoksa 401 dön
  if (!req.user) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Kimlik doğrulaması gerekli." });
  }

  try {
    const { title, content, tags } = req.body;
    // ✅ Hardcoded test ID'si kaldırıldı; gerçek kullanıcı ID'si middleware'den geliyor
    const userId = req.user._id ?? req.user.id;

    const savedPost = await postService.createPost({ userId, title, content, tags });
    
    // RabbitMQ'ya asenkron işlem için mesaj gönderiliyor
    try {
      const channel = getChannel();
      const queue = 'campify_post_queue';
      
      const message = JSON.stringify({
        postId: savedPost._id || savedPost.id,
        title: savedPost.title,
        content: savedPost.content,
        userId: userId
      });

      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
    } catch (mqError) {
      console.error('RabbitMQ kuyruğuna mesaj gönderilemedi:', mqError);
      // Gönderi MongoDB'ye kaydedildiği için hatayı fırlatmıyoruz, akış devam ediyor.
    }

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ code: "VALIDATION_ERROR", message: error.message });
  }
};

// 2. Gönderileri Listeleme (GET)
exports.getPosts = async (req, res) => {
  try {
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

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};