const jwt = require('jsonwebtoken');

// ده الـ "حارس" اللي بيقف قبل أي route خاص بالأدمن
// بيتحقق إن فيه توكن صحيح قبل ما يسمح بتنفيذ الطلب
const protect = (req, res, next) => {
  let token;

  // التوكن بييجي في الهيدر بالشكل: "Bearer xxxxxxxxxx"
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // ناخد التوكن من بعد كلمة "Bearer "
      token = authHeader.split(' ')[1];

      // نتحقق إن التوكن صحيح ومش منتهي الصلاحية
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // نحفظ بيانات الأدمن في الـ request عشان نستخدمها بعدين لو احتجنا
      req.admin = decoded;

      // التوكن سليم، يبقى نكمل لباقي الكود (الـ controller)
      next();
    } catch (error) {
      res.status(401).json({
        message: 'غير مصرح لك - التوكن غير صحيح أو منتهي الصلاحية',
      });
    }
  } else {
    res.status(401).json({
      message: 'غير مصرح لك - لا يوجد توكن',
    });
  }
};

module.exports = { protect };