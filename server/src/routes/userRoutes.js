const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Profile routes
router.get('/:userId', authMiddleware, userController.getUserProfile);
router.put("/", authMiddleware, userController.updateUserProfile);
router.delete("/", authMiddleware, userController.deleteProfile);

module.exports = router;