const express = require('express');
const router = express.Router();
const {
  getPlatformLinks,
  getPlatformLinkById,
  createPlatformLink,
  updatePlatformLink,
  deletePlatformLink,
} = require('../controllers/platformLinkController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getPlatformLinks);
router.get('/:id', getPlatformLinkById);

router.post('/', protect, upload.uploadPlatformLogo, createPlatformLink);
router.put('/:id', protect, upload.uploadPlatformLogo, updatePlatformLink);
router.delete('/:id', protect, deletePlatformLink);

module.exports = router;