const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getCertificates);
router.get('/:id', getCertificateById);

router.post('/', protect, upload.uploadCertificateFiles, createCertificate);
router.put('/:id', protect, upload.uploadCertificateFiles, updateCertificate);
router.delete('/:id', protect, deleteCertificate);

module.exports = router;