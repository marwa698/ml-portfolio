const Education = require('../models/Education');

// GET /api/education
const getEducation = async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب بيانات التعليم', error: error.message });
  }
};

// GET /api/education/:id
const getEducationById = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب العنصر', error: error.message });
  }
};

// POST /api/education
const createEducation = async (req, res) => {
  try {
    const { institution, program, period, status, type, description, link, order } = req.body;

    const logoUrl = req.file ? req.file.path : '';
    if (!logoUrl) {
      return res.status(400).json({ message: 'لوجو الجهة مطلوب' });
    }

    const item = await Education.create({
      institution,
      program,
      period,
      status: status || '',
      type: type || 'Online Course',
      description: description || '',
      logoUrl,
      link: link || '',
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة العنصر', error: error.message });
  }
};

// PUT /api/education/:id
const updateEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'العنصر غير موجود' });
    }

    const { institution, program, period, status, type, description, link, order } = req.body;

    item.institution = institution ?? item.institution;
    item.program = program ?? item.program;
    item.period = period ?? item.period;
    item.status = status ?? item.status;
    item.type = type ?? item.type;
    item.description = description ?? item.description;
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

// DELETE /api/education/:id
const deleteEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
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
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};