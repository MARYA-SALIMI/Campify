const Post = require('../models/Post');

// 1. Gönderi Oluşturma
exports.createPost = async (postData) => {
  const newPost = new Post(postData);
  return await newPost.save();
};

// 2. Gönderileri Listeleme (Sayfalama ile)
exports.getAllPosts = async (page = 1, limit = 10, userId = null) => {
  const query = userId ? { userId } : {};
  return await Post.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 }); // En yeniler en üstte görünsün
};

// 3. Gönderi Güncelleme
exports.updatePost = async (postId, updateData) => {
  return await Post.findByIdAndUpdate(postId, updateData, { new: true, runValidators: true });
};

// 4. Gönderi Silme
exports.deletePost = async (postId) => {
  return await Post.findByIdAndDelete(postId);
};