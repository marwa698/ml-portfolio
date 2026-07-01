const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, updateProfileImage, updateCV } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const uploadCV = require('../middleware/uploadCV');

router.get('/', getSettings); // GET /api/settings - عام

router.put('/', protect, updateSettings); // محمي - تعديل البيانات النصية
router.put('/profile-image', protect, upload.single('image'), updateProfileImage); // محمي - رفع الصورة
router.put('/cv', protect, uploadCV.single('cv'), updateCV); // محمي - رفع السيرة الذاتية

module.exports = router;