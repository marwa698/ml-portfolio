const Settings = require('../models/Settings');

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الإعدادات', error: error.message });
  }
};

// PUT /api/settings
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
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم إرفاق صورة' });
    }

    const settings = await getOrCreateSettings();
    settings.profileImage = req.file.path;
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في رفع الصورة', error: error.message });
  }
};

// PUT /api/settings/cv
const updateCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم إرفاق ملف' });
    }

    const settings = await getOrCreateSettings();
    settings.cvFile = req.file.path;
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في رفع ملف السيرة الذاتية', error: error.message });
  }
};

module.exports = { getSettings, updateSettings, updateProfileImage, updateCV };