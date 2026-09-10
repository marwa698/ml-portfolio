const mongoose = require('mongoose');

// شكل بيانات "التعليم" في قاعدة البيانات
// كل عنصر بيمثل جامعة أو كورس أو تدريب مهني ظاهر في قسم Education بالبورتوفوليو
const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'اسم الجهة التعليمية مطلوب'],
      trim: true,
    },
    // اسم الدرجة أو الكورس، مثلاً "B.Sc. in Artificial Intelligence"
    program: {
      type: String,
      required: [true, 'اسم الدرجة أو الكورس مطلوب'],
      trim: true,
    },
    // النص الظاهر في التايم لاين، مثلاً "2024 – 2028" أو "2026"
    period: {
      type: String,
      required: true,
    },
    // نص إضافي اختياري تحت الفترة، مثلاً "Expected Graduation Jun 2028" أو "Completed"
    status: {
      type: String,
      default: '',
    },
    // نوع العنصر، بيظهر كـ badge: Undergraduate / Online Course / Professional Training / إلخ
    type: {
      type: String,
      default: 'Online Course',
    },
    description: {
      type: String,
      default: '',
    },
    // لوجو الجهة (رفعة واحدة، زي لوجو الشهادة)
    logoUrl: {
      type: String,
      required: true,
    },
    // رابط خارجي اختياري (صفحة الكورس أو الجامعة)
    link: {
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

module.exports = mongoose.model('Education', educationSchema);