const mongoose = require('mongoose');

// شكل بيانات "الإنجاز" — كارت بسيط: أيقونة/لوجو + عنوان + مصدر + وصف
// مختلف تمامًا عن الشهادات (Certificates)، ومفيهوش صورة شهادة ولا تاريخ
const achievementSchema = new mongoose.Schema(
  {
    titleEn: { type: String, required: [true, 'العنوان بالإنجليزي مطلوب'], trim: true },
    titleAr: { type: String, required: [true, 'العنوان بالعربي مطلوب'], trim: true },

    // المصدر/الجهة، مثلاً "Digital Egypt Pioneers Initiative"
    subtitleEn: { type: String, required: [true, 'المصدر بالإنجليزي مطلوب'], trim: true },
    subtitleAr: { type: String, required: [true, 'المصدر بالعربي مطلوب'], trim: true },

    descriptionEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },

    // لوجو/أيقونة الإنجاز (رفعة واحدة، زي Education وExperience)
    logoUrl: { type: String, required: true },

    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);