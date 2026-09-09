const mongoose = require('mongoose');

// شكل بيانات "الإعدادات العامة" في قاعدة البيانات
// ده موديل خاص: هيكون فيه document واحد بس دايماً (مش قائمة)
// لأنه بيمثل بيانات الشخص نفسها، مش عناصر متعددة زي المشاريع
const settingsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: 'marwa.yousry@email.com',
    },
    phone: {
      type: String,
      default: '+20 100 123 4567',
    },
    location: {
      type: String,
      default: 'Egypt',
    },
    // اسم ملف الصورة الشخصية المرفوعة (تظهر في الـ Hero section)
    profileImage: {
      type: String,
      default: '',
    },
    // اسم ملف السيرة الذاتية المرفوعة (PDF)
    cvFile: {
      type: String,
      default: '',
    },
    // روابط التواصل الاجتماعي - كل واحد اختياري
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    // الوصف اللي بيظهر تحت كل تاب في قسم Skills بالبورتوفوليو
    // مفتاح كل عنصر هو اسم التصنيف بالظبط (Technical, Soft Skills, Tools, Languages)
    skillCategoryDescriptions: {
      type: Map,
      of: new mongoose.Schema(
        {
          en: { type: String, default: '' },
          ar: { type: String, default: '' },
        },
        { _id: false }
      ),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);