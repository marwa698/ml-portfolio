const mongoose = require('mongoose');

// شكل بيانات "الخبرة العملية" في قاعدة البيانات
// كل عنصر بيمثل تدريب/انترنشيب/وظيفة ظاهرة في قسم Work Experience بالبورتوفوليو
// كل حقل نصي مهم (العنوان، الوصف، النقاط) له نسخة إنجليزي وعربي منفصلة
// عشان لما اليوزر يبدل اللغة، المحتوى كله يتبدل معاه مش بس العناصر الثابتة

const bulletSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    // المسمى الوظيفي، مثلاً "Backend Developer Intern"
    titleEn: { type: String, required: [true, 'العنوان بالإنجليزي مطلوب'], trim: true },
    titleAr: { type: String, required: [true, 'العنوان بالعربي مطلوب'], trim: true },

    // اسم الجهة، مثلاً "Information Technology Institute (ITI)"
    organizationEn: { type: String, required: [true, 'اسم الجهة بالإنجليزي مطلوب'], trim: true },
    organizationAr: { type: String, required: [true, 'اسم الجهة بالعربي مطلوب'], trim: true },

    // نوع الخبرة، من قايمة ثابتة، والترجمة بتتحصل تلقائيًا في الفرونت إند (مش محتاجة تتكتب مرتين)
    employmentType: {
      type: String,
      enum: ['internship', 'training', 'job', 'freelance'],
      default: 'internship',
    },

    // مكان الشغل، برضه من قايمة ثابتة ومترجمة تلقائيًا
    locationType: {
      type: String,
      enum: ['remote', 'onsite', 'online', 'hybrid'],
      default: 'remote',
    },

    // الفترة الظاهرة في التايم لاين، بنسختين عشان أسماء الشهور بتتغير باللغتين
    periodEn: { type: String, required: true, trim: true }, // "Sep 2024 – Present"
    periodAr: { type: String, required: true, trim: true }, // "سبتمبر 2024 – حتى الآن"

    // نص قصير جدًا تحت الفترة زي "Ongoing" / "جارية حاليًا"
    statusEn: { type: String, default: '' },
    statusAr: { type: String, default: '' },

    // سطر مختصر إضافي زي "Building real systems" / "بناء أنظمة حقيقية"
    highlightEn: { type: String, default: '' },
    highlightAr: { type: String, default: '' },

    // الوصف الكامل الظاهر في الـ Modal تحت "About"
    descriptionEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },

    // نقاط "What I Did"، كل نقطة بنسختين إنجليزي وعربي
    bullets: { type: [bulletSchema], default: [] },

    // التكنولوجيز، مش بتتترجم لأنها مصطلحات تقنية بتتكتب إنجليزي في الحالتين
    technologies: { type: [String], default: [] },

    // لوجو الجهة
    logoUrl: { type: String, required: true },

    // رابط خارجي اختياري (لينكدإن الجهة، صفحة البرنامج...)
    link: { type: String, default: '' },

    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);