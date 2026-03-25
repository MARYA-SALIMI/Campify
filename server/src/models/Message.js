const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Mesaj içeriği boş olamaz'],
    maxlength: [1000, 'Mesaj en fazla 1000 karakter olabilir']
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);