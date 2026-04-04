
const express = require('express');
const router = express.Router();

const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes'); // ← Üste taşındı

router.use('/posts', postRoutes);
router.use('/chats', chatRoutes); // ← Üste taşındı

module.exports = router; // ← EN SONA geldi