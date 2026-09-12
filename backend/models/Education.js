const mongoose = require('mongoose');

// شكل بيانات "التعليم" — كل حقل نصي مهم له نسخة إنجليزي وعربي منفصلة
// عشان لما اليوزر يبدل اللغة، المحتوى كله يتبدل معاه مش بس العناصر الثابتة
const educationSchema = new mongoose.Schema(
  {
    institutionEn: { type: String, required: [true, 'اسم الجهة بالإنجليزي مطلوب'], trim: true },
    institutionAr: { type: String, required: [true, 'اسم الجهة بالعربي مطلوب'], trim: true },

    // اسم الدرجة أو الكورس
    programEn: { type: String, required: [true, 'اسم الكورس بالإنجليزي مطلوب'], trim: true },
    programAr: { type: String, required: [true, 'اسم الكورس بالعربي مطلوب'], trim: true },

    // النص الظاهر في التايم لاين، مثلاً "2024 – 2028"
    periodEn: { type: String, required: true, trim: true },
    periodAr: { type: String, required: true, trim: true },

    // نص إضافي اختياري تحت الفترة، مثلاً "Completed" / "Expected Graduation..."
    statusEn: { type: String, default: '' },
    statusAr: { type: String, default: '' },

    // نوع العنصر — من قايمة ثابتة، والترجمة بتتحصل تلقائيًا في الفرونت إند (مش محتاجة تتكتب مرتين)
    type: {
      type: String,
      enum: ['Undergraduate', 'Online Course', 'Professional Training'],
      default: 'Online Course',
    },

    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },

    // لوجو الجهة
    logoUrl: { type: String, required: true },

    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);