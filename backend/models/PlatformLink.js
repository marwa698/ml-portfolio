const mongoose = require('mongoose');

// شكل بيانات "منصة العمل الحر" - بتظهر كبادچ في الفوتر (Fiverr, Upwork, Mostaql, إلخ)
const platformLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم المنصة مطلوب'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'رابط البروفايل مطلوب'],
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
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

module.exports = mongoose.model('PlatformLink', platformLinkSchema);