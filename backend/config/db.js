const mongoose = require('mongoose');

// دالة الاتصال بقاعدة البيانات
// بتتنادي مرة واحدة لما السيرفر يبدأ في server.js
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✓ MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ فشل الاتصال بقاعدة البيانات: ${error.message}`);
    // لو فشل الاتصال، نوقف السيرفر بدل ما يفضل شغال بدون داتابيز
    process.exit(1);
  }
};

module.exports = connectDB;