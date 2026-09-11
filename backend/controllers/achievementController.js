const Achievement = require('../models/Achievement');

const getAchievements = async (req, res) => {
  try {
    const items = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب بيانات الإنجازات', error: error.message });
  }
};

const getAchievementById = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب العنصر', error: error.message });
  }
};

const createAchievement = async (req, res) => {
  try {
    const { titleEn, titleAr, subtitleEn, subtitleAr, descriptionEn, descriptionAr, link, order } = req.body;

    const logoUrl = req.file ? req.file.path : '';
    if (!logoUrl) {
      return res.status(400).json({ message: 'لوجو/أيقونة الإنجاز مطلوبة' });
    }

    const item = await Achievement.create({
      titleEn, titleAr, subtitleEn, subtitleAr, descriptionEn, descriptionAr,
      logoUrl,
      link: link || '',
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة العنصر', error: error.message });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });

    const { titleEn, titleAr, subtitleEn, subtitleAr, descriptionEn, descriptionAr, link, order } = req.body;

    item.titleEn = titleEn ?? item.titleEn;
    item.titleAr = titleAr ?? item.titleAr;
    item.subtitleEn = subtitleEn ?? item.subtitleEn;
    item.subtitleAr = subtitleAr ?? item.subtitleAr;
    item.descriptionEn = descriptionEn ?? item.descriptionEn;
    item.descriptionAr = descriptionAr ?? item.descriptionAr;
    item.link = link ?? item.link;
    item.order = order ?? item.order;

    if (req.file) item.logoUrl = req.file.path;

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل العنصر', error: error.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });
    await item.deleteOne();
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في الحذف', error: error.message });
  }
};

module.exports = { getAchievements, getAchievementById, createAchievement, updateAchievement, deleteAchievement };