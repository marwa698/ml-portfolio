const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// دالة مساعدة لإنشاء التوكن
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // التوكن صالح لمدة أسبوع
  });
};

// POST /api/auth/login
// تسجيل دخول الأدمن - الخطوة الأولى قبل الدخول للوحة التحكم
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'اسم المستخدم وكلمة السر مطلوبين' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة السر غير صحيحة' });
    }

    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة السر غير صحيحة' });
    }

    // كل حاجة تمام، نرجع التوكن
    const token = generateToken(admin._id);

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تسجيل الدخول', error: error.message });
  }
};

// GET /api/auth/verify
// بتستخدمها صفحة الأدمن عشان تتأكد إن التوكن المحفوظ لسه صالح
// (مفيد لو الأدمن فتح الصفحة بعد فترة طويلة)
const verifyToken = async (req, res) => {
  // لو الكود وصل هنا، يبقى الـ middleware (protect) أكد إن التوكن سليم
  res.json({ valid: true, admin: req.admin });
};

module.exports = { login, verifyToken };