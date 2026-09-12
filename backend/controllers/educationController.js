const Education = require('../models/Education');

const getEducation = async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب بيانات التعليم', error: error.message });
  }
};

const getEducationById = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب العنصر', error: error.message });
  }
};

const createEducation = async (req, res) => {
  try {
    const {
      institutionEn, institutionAr,
      programEn, programAr,
      periodEn, periodAr,
      statusEn, statusAr,
      type, descriptionEn, descriptionAr,
      link, order,
    } = req.body;

    const logoUrl = req.file ? req.file.path : '';
    if (!logoUrl) {
      return res.status(400).json({ message: 'لوجو الجهة مطلوب' });
    }

    const item = await Education.create({
      institutionEn, institutionAr,
      programEn, programAr,
      periodEn, periodAr,
      statusEn: statusEn || '',
      statusAr: statusAr || '',
      type: type || 'Online Course',
      descriptionEn: descriptionEn || '',
      descriptionAr: descriptionAr || '',
      logoUrl,
      link: link || '',
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة العنصر', error: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });

    const {
      institutionEn, institutionAr,
      programEn, programAr,
      periodEn, periodAr,
      statusEn, statusAr,
      type, descriptionEn, descriptionAr,
      link, order,
    } = req.body;

    item.institutionEn = institutionEn ?? item.institutionEn;
    item.institutionAr = institutionAr ?? item.institutionAr;
    item.programEn = programEn ?? item.programEn;
    item.programAr = programAr ?? item.programAr;
    item.periodEn = periodEn ?? item.periodEn;
    item.periodAr = periodAr ?? item.periodAr;
    item.statusEn = statusEn ?? item.statusEn;
    item.statusAr = statusAr ?? item.statusAr;
    item.type = type ?? item.type;
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

const deleteEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });
    await item.deleteOne();
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في الحذف', error: error.message });
  }
};

module.exports = { getEducation, getEducationById, createEducation, updateEducation, deleteEducation };