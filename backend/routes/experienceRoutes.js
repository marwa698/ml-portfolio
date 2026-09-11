const express = require('express');
const router = express.Router();
const {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getExperience);
router.get('/:id', getExperienceById);

router.post('/', protect, upload.uploadExperienceLogo, createExperience);
router.put('/:id', protect, upload.uploadExperienceLogo, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;