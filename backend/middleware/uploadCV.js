const multer = require('multer');
const path = require('path');

// middleware مخصص لرفع ملف CV بصيغة PDF فقط
// مفصول عن upload.js (اللي مخصص للصور) لأن الفلتر مختلف

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = `cv-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const isValid = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مسموح - يجب أن يكون السيرة الذاتية بصيغة PDF فقط'));
  }
};

const uploadCV = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // أقصى حجم 5 ميجابايت
});

module.exports = uploadCV;