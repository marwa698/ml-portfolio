const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// شكل بيانات "الأدمن" - عادةً هيكون حساب واحد بس (انتي)
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// قبل ما نحفظ الأدمن في قاعدة البيانات، نشفر كلمة السر تلقائياً
// ده middleware بيشتغل تلقائي مع كل .save()
adminSchema.pre('save', async function (next) {
  // لو كلمة السر متغيرتش، مفيش داعي نعيد تشفيرها
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// دالة مساعدة للتحقق من كلمة السر عند تسجيل الدخول
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);