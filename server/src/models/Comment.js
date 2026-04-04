const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Yorumu yapan kişinin ID'si (Giriş yapan kullanıcıdan alacağız)
  },
  text: { 
    type: String, 
    required: true,
    minlength: 1 
  }
}, { timestamps: true }); // timestamps, 'createdAt' ve 'updatedAt' tarihlerini otomatik ekler

module.exports = mongoose.model('comments', commentSchema);