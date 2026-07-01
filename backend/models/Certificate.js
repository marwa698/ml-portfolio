const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'اسم الشهادة مطلوب'], trim: true },
    issuer: { type: String, required: [true, 'الجهة المانحة مطلوبة'], trim: true },
    year: { type: String, required: true },
    // لوجو الجهة المانحة - يظهر في كروت البورتوفوليو
    logoUrl: { type: String, required: true },
    // صورة الشهادة الفعلية - تظهر في صفحة التفاصيل بس
    certificateImageUrl: { type: String, default: '' },
    verificationLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
    description: { type: String, default: '' },
    relatedProjects: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);