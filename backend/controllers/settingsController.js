const Settings = require('../models/Settings');
const fs = require('fs');
const path = require('path');

// دالة مساعدة: تجيب الإعدادات، ولو معندهاش document لسه، تعمل واحد بالقيم الافتراضية
// كده نضمن إن فيه دايماً document واحد بس للإعدادات (مش أكتر ومش أقل)
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// GET /api/settings
// عام - بيستخدمه أي زائر لعرض بيانات التواصل في الصفحة الرئيسية وصفحة Contact
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الإعدادات', error: error.message });
  }
};

// PUT /api/settings
// محمي - تعديل البيانات النصية (إيميل، تليفون، موقع، روابط التواصل)
const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const { email, phone, location, github, linkedin, whatsapp, instagram } = req.body;

    settings.email = email ?? settings.email;
    settings.phone = phone ?? settings.phone;
    settings.location = location ?? settings.location;

    settings.socialLinks.github = github ?? settings.socialLinks.github;
    settings.socialLinks.linkedin = linkedin ?? settings.socialLinks.linkedin;
    settings.socialLinks.whatsapp = whatsapp ?? settings.socialLinks.whatsapp;
    settings.socialLinks.instagram = instagram ?? settings.socialLinks.instagram;

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل الإعدادات', error: error.message });
  }
};

// PUT /api/settings/profile-image
// محمي - رفع أو تغيير الصورة الشخصية
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم إرفاق صورة' });
    }

    const settings = await getOrCreateSettings();

    // نحذف الصورة القديمة من السيرفر لو موجودة
    if (settings.profileImage) {
      const oldPath = path.join(__dirname, '..', 'uploads', settings.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    settings.profileImage = req.file.filename;
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في رفع الصورة', error: error.message });
  }
};

// PUT /api/settings/cv
// محمي - رفع أو تغيير ملف السيرة الذاتية
const updateCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم إرفاق ملف' });
    }

    const settings = await getOrCreateSettings();

    if (settings.cvFile) {
      const oldPath = path.join(__dirname, '..', 'uploads', settings.cvFile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    settings.cvFile = req.file.filename;
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في رفع ملف السيرة الذاتية', error: error.message });
  }
};

module.exports = { getSettings, updateSettings, updateProfileImage, updateCV };