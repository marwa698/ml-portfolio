const mongoose = require('mongoose');

// شكل بيانات "المهارة" في قاعدة البيانات
// دي اللي بتظهر في قسم "What I'm good at" مع شريط النسبة
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم المهارة مطلوب'],
      trim: true,
    },
    // اسم أيقونة من مكتبة أيقونات (مثلاً "python", "tensorflow")
    icon: {
      type: String,
      required: true,
    },
    // نسبة الإتقان من 0 إلى 100، بتظهر في شريط التقدم
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    // تصنيف المهارة لو عايزة تقسيمها (Language, Framework, Tool)
    category: {
      type: String,
      default: 'General',
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

module.exports = mongoose.model('Skill', skillSchema);