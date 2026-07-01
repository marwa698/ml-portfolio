const mongoose = require('mongoose');

// شكل بيانات "المشروع" في قاعدة البيانات
// كل مشروع في صفحة Projects هيكون عنده الحقول دي
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'اسم المشروع مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'وصف المشروع مطلوب'],
    },
    // وصف قصير يظهر في كارت المشروع بصفحة Projects
    shortDescription: {
      type: String,
      required: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: true,
      enum: ['Deep Learning', 'NLP', 'Machine Learning', 'Computer Vision', 'Data Science'],
    },
    // اسم ملف الصورة المرفوعة (بيتم تخزينه في مجلد uploads)
    imageUrl: {
      type: String,
      required: true,
    },
    // التقنيات المستخدمة، مخزنة كـ array من النصوص
    technologies: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: '',
    },
    liveLink: {
      type: String,
      default: '',
    },
    // محتوى تفصيلي لصفحة تفاصيل المشروع (المشكلة، الحل، النتائج)
    fullDetails: {
      problem: { type: String, default: '' },
      solution: { type: String, default: '' },
      results: { type: String, default: '' },
    },
    // ترتيب ظهور المشروع (الأقل رقم يظهر أول)
    order: {
      type: Number,
      default: 0,
    },
    // لو false، المشروع محفوظ بس مش ظاهر للزوار (مفيد للمسودات)
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    // بيضيف createdAt و updatedAt تلقائياً
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);