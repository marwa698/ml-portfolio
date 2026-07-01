const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login); // POST /api/auth/login - عام
router.get('/verify', protect, verifyToken); // محمي - للتحقق من صلاحية التوكن

module.exports = router;