const Certificate = require('../models/Certificate');

// GET /api/certificates
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الشهادات', error: error.message });
  }
};

// GET /api/certificates/:id
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'الشهادة غير موجودة' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الشهادة', error: error.message });
  }
};

// POST /api/certificates
const createCertificate = async (req, res) => {
  try {
    const { title, issuer, year, verificationLink, order, description, relatedProjects } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    if (!imageUrl) {
      return res.status(400).json({ message: 'صورة أو شعار الشهادة مطلوب' });
    }

    // relatedProjects بييجي كنص فيه سطر لكل مشروع، فبنحوله لـ array
    const projectsArray = relatedProjects
      ? relatedProjects.split('\n').map((p) => p.trim()).filter((p) => p.length > 0)
      : [];

    const certificate = await Certificate.create({
      title,
      issuer,
      year,
      verificationLink,
      imageUrl,
      order: order || 0,
      description: description || '',
      relatedProjects: projectsArray,
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة الشهادة', error: error.message });
  }
};

// PUT /api/certificates/:id
const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'الشهادة غير موجودة' });
    }

    const { title, issuer, year, verificationLink, order, description, relatedProjects } = req.body;

    certificate.title = title ?? certificate.title;
    certificate.issuer = issuer ?? certificate.issuer;
    certificate.year = year ?? certificate.year;
    certificate.verificationLink = verificationLink ?? certificate.verificationLink;
    certificate.order = order ?? certificate.order;
    certificate.description = description ?? certificate.description;

    if (relatedProjects !== undefined) {
      certificate.relatedProjects = relatedProjects
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }

    if (req.file) {
      certificate.imageUrl = req.file.path;
    }

    const updatedCertificate = await certificate.save();
    res.json(updatedCertificate);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل الشهادة', error: error.message });
  }
};

// DELETE /api/certificates/:id
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'الشهادة غير موجودة' });
    }
    await certificate.deleteOne();
    res.json({ message: 'تم حذف الشهادة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في حذف الشهادة', error: error.message });
  }
};

module.exports = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};