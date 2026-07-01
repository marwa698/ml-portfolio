const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'اسم الشهادة مطلوب'], trim: true },
    issuer: { type: String, required: [true, 'الجهة المانحة مطلوبة'], trim: true },
    year: { type: String, required: true },
    imageUrl: { type: String, required: true },
    verificationLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
    // وصف تفصيلي لمحتوى الكورس/الشهادة (يظهر في صفحة التفاصيل)
    description: { type: String, default: '' },
    // المشاريع اللي اتعملت كجزء من الكورس ده (اختياري)، كل عنصر سطر نص
    relatedProjects: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);