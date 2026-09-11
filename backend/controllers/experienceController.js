const Experience = require('../models/Experience');

// GET /api/experience
const getExperience = async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب بيانات الخبرات', error: error.message });
  }
};

// GET /api/experience/:id
const getExperienceById = async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب العنصر', error: error.message });
  }
};

// بيانات bullets و technologies بتوصل كـ JSON string جوه FormData
// الدالة دي بتحولهم لـ array عادي، ولو حصل خطأ في الـ parsing بترجع array فاضي
function parseJsonField(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

// POST /api/experience
const createExperience = async (req, res) => {
  try {
    const {
      titleEn, titleAr,
      organizationEn, organizationAr,
      employmentType, locationType,
      periodEn, periodAr,
      statusEn, statusAr,
      highlightEn, highlightAr,
      descriptionEn, descriptionAr,
      bullets, technologies,
      link, order,
    } = req.body;

    const logoUrl = req.file ? req.file.path : '';
    if (!logoUrl) {
      return res.status(400).json({ message: 'لوجو الجهة مطلوب' });
    }

    const item = await Experience.create({
      titleEn, titleAr,
      organizationEn, organizationAr,
      employmentType: employmentType || 'internship',
      locationType: locationType || 'remote',
      periodEn, periodAr,
      statusEn: statusEn || '',
      statusAr: statusAr || '',
      highlightEn: highlightEn || '',
      highlightAr: highlightAr || '',
      descriptionEn, descriptionAr,
      bullets: parseJsonField(bullets),
      technologies: parseJsonField(technologies),
      logoUrl,
      link: link || '',
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة العنصر', error: error.message });
  }
};

// PUT /api/experience/:id
const updateExperience = async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }

    const {
      titleEn, titleAr,
      organizationEn, organizationAr,
      employmentType, locationType,
      periodEn, periodAr,
      statusEn, statusAr,
      highlightEn, highlightAr,
      descriptionEn, descriptionAr,
      bullets, technologies,
      link, order,
    } = req.body;

    item.titleEn = titleEn ?? item.titleEn;
    item.titleAr = titleAr ?? item.titleAr;
    item.organizationEn = organizationEn ?? item.organizationEn;
    item.organizationAr = organizationAr ?? item.organizationAr;
    item.employmentType = employmentType ?? item.employmentType;
    item.locationType = locationType ?? item.locationType;
    item.periodEn = periodEn ?? item.periodEn;
    item.periodAr = periodAr ?? item.periodAr;
    item.statusEn = statusEn ?? item.statusEn;
    item.statusAr = statusAr ?? item.statusAr;
    item.highlightEn = highlightEn ?? item.highlightEn;
    item.highlightAr = highlightAr ?? item.highlightAr;
    item.descriptionEn = descriptionEn ?? item.descriptionEn;
    item.descriptionAr = descriptionAr ?? item.descriptionAr;
    if (bullets !== undefined) item.bullets = parseJsonField(bullets);
    if (technologies !== undefined) item.technologies = parseJsonField(technologies);
    item.link = link ?? item.link;
    item.order = order ?? item.order;

    if (req.file) {
      item.logoUrl = req.file.path;
    }

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل العنصر', error: error.message });
  }
};

// DELETE /api/experience/:id
const deleteExperience = async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
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
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};