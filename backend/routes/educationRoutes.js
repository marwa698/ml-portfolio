const express = require('express');
const router = express.Router();
const {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getEducation);
router.get('/:id', getEducationById);

router.post('/', protect, upload.uploadEducationLogo, createEducation);
router.put('/:id', protect, upload.uploadEducationLogo, updateEducation);
router.delete('/:id', protect, deleteEducation);

module.exports = router;