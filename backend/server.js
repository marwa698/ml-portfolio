require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// استدعاء كل ملفات المسارات
const projectRoutes = require('./routes/projectRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const skillRoutes = require('./routes/skillRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// نتصل بقاعدة البيانات قبل أي حاجة
connectDB();

const app = express();

// === Middleware عامة ===

// CORS: نسمح للفرونت إند بالاتصال بالـ API
// في التطوير المحلي، localhost و 127.0.0.1 بيتعاملوا كنطاقين مختلفين تماماً
// من ناحية CORS حتى لو بيوصلوا لنفس الجهاز، فبنسمح بالاتنين مع أي بورت
// عشان ما تتكررش مشكلة "Failed to fetch" بسبب اختلاف الرابط المستخدم
const allowedOrigins = [
  process.env.FRONTEND_URL,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // الطلبات من أدوات زي Postman (بدون origin) بنسمح بيها في التطوير
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) =>
        allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
      );

      callback(null, isAllowed);
    },
  })
);

// نسمح لـ Express يفهم JSON جاي من الفرونت إند (مثل نموذج التواصل)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// نخلي مجلد uploads متاح للجميع عشان الصور تظهر في المتصفح
// مثال: GET /uploads/1234567-image.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === المسارات ===
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// مسار اختباري بسيط للتأكد إن السيرفر شغال
app.get('/', (req, res) => {
  res.json({ message: 'ML Portfolio API شغال تمام ✓' });
});

// === معالجة الأخطاء العامة ===
// لو حصل خطأ مش متوقع في أي route، يتمسك هنا بدل ما السيرفر يقع
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'حصل خطأ غير متوقع في السيرفر', error: err.message });
});

// مسار غير موجود (404)
app.use((req, res) => {
  res.status(404).json({ message: 'الرابط المطلوب غير موجود' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
});