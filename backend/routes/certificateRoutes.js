const express = require('express');
const router = express.Router();
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getCertificates); // GET /api/certificates - عام

router.post('/', protect, upload.single('image'), createCertificate); // محمي
router.put('/:id', protect, upload.single('image'), updateCertificate); // محمي
router.delete('/:id', protect, deleteCertificate); // محمي

module.exports = router;