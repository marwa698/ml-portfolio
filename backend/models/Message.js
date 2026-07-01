const mongoose = require('mongoose');

// شكل بيانات "الرسالة" اللي بتيجي من صفحة Contact
const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'نص الرسالة مطلوب'],
    },
    // لتتبع إذا كانت الرسالة اتقرت من الأدمن أو لسه جديدة
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);