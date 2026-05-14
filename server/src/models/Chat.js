const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  text: { type: String, required: true },
  chatId: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  likes: [{ type: String }],
  isSeen: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Chat', messageSchema);