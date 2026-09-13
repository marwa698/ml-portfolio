const mongoose = require('mongoose');

const projectRefSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const certificateSchema = new mongoose.Schema(
  {
    titleEn: { type: String, required: [true, 'اسم الشهادة بالإنجليزي مطلوب'], trim: true },
    titleAr: { type: String, required: [true, 'اسم الشهادة بالعربي مطلوب'], trim: true },

    issuerEn: { type: String, required: [true, 'الجهة المانحة بالإنجليزي مطلوبة'], trim: true },
    issuerAr: { type: String, required: [true, 'الجهة المانحة بالعربي مطلوبة'], trim: true },

    year: { type: String, required: true },

    logoUrl: { type: String, required: true },
    certificateImageUrl: { type: String, default: '' },
    verificationLink: { type: String, default: '' },
    order: { type: Number, default: 0 },

    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },

    // مشاريع مرتبطة، كل واحد بنسخة إنجليزي وعربي
    relatedProjects: { type: [projectRefSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);