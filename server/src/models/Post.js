const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı ID si zorunludur']
  },
  title: {
    type: String,
    required: [true, 'Gönderi başlığı zorunludur'],
    minlength: [3, 'Başlık en az 3 karakter olmalıdır'],
    maxlength: [150, 'Başlık en fazla 150 karakter olabilir']
  },
  content: {
    type: String,
    required: [true, 'Gönderi içeriği zorunludur'],
    minlength: [10, 'İçerik en az 10 karakter olmalıdır'],
    maxlength: [2000, 'İçerik en fazla 2000 karakter olabilir']
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true // Bu ayar createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('Post', postSchema);