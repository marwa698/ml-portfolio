const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', sendMessage); // POST /api/messages - عام (من صفحة Contact)

router.get('/', protect, getMessages); // محمي - لوحة الأدمن
router.put('/:id/read', protect, markAsRead); // محمي
router.delete('/:id', protect, deleteMessage); // محمي

module.exports = router;