const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// middleware مخصص لرفع ملف CV بصيغة PDF فقط على Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ml-portfolio/cv',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // مهم جدًا: لازم "raw" مش "image" عشان الملف PDF مش صورة
    public_id: (req, file) => `cv-${Date.now()}`,
  },
});

const uploadCV = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // أقصى حجم 5 ميجابايت
});

module.exports = uploadCV;