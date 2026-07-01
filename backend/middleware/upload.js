const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// نحدد إن الصور تترفع مباشرة على Cloudinary بدل التخزين المحلي
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ml-portfolio', // اسم الفولدر اللي هتتخزن فيه الصور على Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    // اسم الملف = الوقت الحالي + رقم عشوائي، عشان مفيش تعارض بين الملفات
    public_id: (req, file) => `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // أقصى حجم 5 ميجابايت
});

module.exports = upload;