const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  lastMessage: {
    content: { type: String, default: '' },
    createdAt: { type: Date, default: null }
  },
  unreadCount: { type: Number, default: 0 },
  typingUsers: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
