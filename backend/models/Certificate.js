const mongoose = require('mongoose');

// شكل بيانات "الشهادة" في قاعدة البيانات
const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'اسم الشهادة مطلوب'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'الجهة المانحة مطلوبة'],
      trim: true,
    },
    year: {
      type: String,
      required: true,
    },
    // أيقونة أو شعار الجهة (اسم ملف الصورة)
    imageUrl: {
      type: String,
      required: true,
    },
    // رابط التحقق من الشهادة (لو موجود)
    verificationLink: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);