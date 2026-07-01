const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ml-portfolio/cv',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
    format: 'pdf', // نحدد الصيغة صراحة عشان الرابط يتولد ومعاه الامتداد الصح
    public_id: (req, file) => `cv-${Date.now()}`,
  },
});

const uploadCV = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadCV;