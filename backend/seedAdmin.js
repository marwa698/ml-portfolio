// سكريبت بيتشغل عشان تنشئي أو تعيدي ضبط حساب الأدمن بتاعك
// طريقة التشغيل: node seedAdmin.js
//
// ⚠️ لو شغلتي السكريبت قبل كده بقيم مختلفة، النسخة دي هتمسح الحساب
// القديم بنفس اسم المستخدم وتنشئ واحد جديد بالباسورد المكتوب تحت،
// عشان تضمني إن الباسورد اللي هتستخدميها هو المتطابق فعلاً مع قاعدة البيانات

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ متصل بقاعدة البيانات');

    // غيّري القيم دي لاسم المستخدم وكلمة السر اللي عايزاها
    const username = 'marwa';
    const password = '1234567890';

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      await Admin.deleteOne({ username });
      console.log('✓ تم حذف الحساب القديم بنفس الاسم');
    }

    const admin = await Admin.create({ username, password });
    console.log(`✓ تم إنشاء حساب الأدمن بنجاح: ${admin.username}`);
    console.log('⚠️  لا تنسي حذف هذا الملف أو تغيير بياناته الآن');

    process.exit(0);
  } catch (error) {
    console.error('✗ حصل خطأ:', error.message);
    process.exit(1);
  }
};

createAdmin();