const multer = require('multer');
const path = require('path');

// نحدد فين تتخزن الصور وبأي اسم
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    // اسم الملف = الوقت الحالي + الامتداد الأصلي
    // ده يضمن إن مفيش ملفين بنفس الاسم يبوظوا في بعض
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// نتحقق إن الملف المرفوع صورة فعلاً (مش أي نوع ملف آخر)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مسموح - الصور المقبولة فقط (jpg, png, webp, svg)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // أقصى حجم 5 ميجابايت
});

module.exports = upload;