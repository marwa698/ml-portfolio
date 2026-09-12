const mongoose = require('mongoose');

// شكل بيانات "رأي العميل" في قاعدة البيانات
const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'اسم العميل مطلوب'],
      trim: true,
    },
    // دور العميل أو مجاله، مثلاً "Data & AI" - اختياري
    role: {
      type: String,
      default: '',
    },
    // تصنيف قصير يظهر كـ badge فوق الرأي، مثلاً "Detail-Oriented" - اختياري
    tag: {
      type: String,
      default: '',
    },
    // التقييم من 1 لـ 5 نجوم
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    // نص الرأي نفسه
    quote: {
      type: String,
      required: [true, 'نص الرأي مطلوب'],
      trim: true,
    },
    // رابط اختياري يثبت مصدر الرأي (صفحة تقييم على منصة فريلانسنج مثلاً)
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

module.exports = mongoose.model('Testimonial', testimonialSchema);