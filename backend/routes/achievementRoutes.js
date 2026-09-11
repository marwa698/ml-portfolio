const express = require('express');
const router = express.Router();
const {
  getAchievements, getAchievementById, createAchievement, updateAchievement, deleteAchievement,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/', protect, upload.uploadAchievementLogo, createAchievement);
router.put('/:id', protect, upload.uploadAchievementLogo, updateAchievement);
router.delete('/:id', protect, deleteAchievement);

module.exports = router;