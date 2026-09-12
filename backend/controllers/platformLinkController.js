const PlatformLink = require('../models/PlatformLink');

// GET /api/platform-links
const getPlatformLinks = async (req, res) => {
  try {
    const items = await PlatformLink.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب منصات العمل', error: error.message });
  }
};

// GET /api/platform-links/:id
const getPlatformLinkById = async (req, res) => {
  try {
    const item = await PlatformLink.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب العنصر', error: error.message });
  }
};

// POST /api/platform-links
const createPlatformLink = async (req, res) => {
  try {
    const { name, url, order } = req.body;

    const logoUrl = req.file ? req.file.path : '';
    if (!logoUrl) {
      return res.status(400).json({ message: 'لوجو المنصة مطلوب' });
    }

    const item = await PlatformLink.create({
      name,
      url,
      logoUrl,
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة المنصة', error: error.message });
  }
};

// PUT /api/platform-links/:id
const updatePlatformLink = async (req, res) => {
  try {
    const item = await PlatformLink.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }

    const { name, url, order } = req.body;

    item.name = name ?? item.name;
    item.url = url ?? item.url;
    item.order = order ?? item.order;

    if (req.file) {
      item.logoUrl = req.file.path;
    }

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل المنصة', error: error.message });
  }
};

// DELETE /api/platform-links/:id
const deletePlatformLink = async (req, res) => {
  try {
    const item = await PlatformLink.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }
    await item.deleteOne();
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في الحذف', error: error.message });
  }
};

module.exports = {
  getPlatformLinks,
  getPlatformLinkById,
  createPlatformLink,
  updatePlatformLink,
  deletePlatformLink,
};