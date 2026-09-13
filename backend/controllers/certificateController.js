const Certificate = require('../models/Certificate');

function parseJsonField(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الشهادات', error: error.message });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'الشهادة غير موجودة' });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الشهادة', error: error.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    const {
      titleEn, titleAr, issuerEn, issuerAr, year,
      verificationLink, order, descriptionEn, descriptionAr, relatedProjects,
    } = req.body;

    const logoUrl = req.files && req.files.logo ? req.files.logo[0].path : '';
    const certificateImageUrl = req.files && req.files.certificateImage ? req.files.certificateImage[0].path : '';

    if (!logoUrl) {
      return res.status(400).json({ message: 'لوجو الجهة المانحة مطلوب' });
    }

    const certificate = await Certificate.create({
      titleEn, titleAr, issuerEn, issuerAr, year,
      verificationLink,
      logoUrl,
      certificateImageUrl,
      order: order || 0,
      descriptionEn: descriptionEn || '',
      descriptionAr: descriptionAr || '',
      relatedProjects: parseJsonField(relatedProjects),
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة الشهادة', error: error.message });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'الشهادة غير موجودة' });

    const {
      titleEn, titleAr, issuerEn, issuerAr, year,
      verificationLink, order, descriptionEn, descriptionAr, relatedProjects,
    } = req.body;

    certificate.titleEn = titleEn ?? certificate.titleEn;
    certificate.titleAr = titleAr ?? certificate.titleAr;
    certificate.issuerEn = issuerEn ?? certificate.issuerEn;
    certificate.issuerAr = issuerAr ?? certificate.issuerAr;
    certificate.year = year ?? certificate.year;
    certificate.verificationLink = verificationLink ?? certificate.verificationLink;
    certificate.order = order ?? certificate.order;
    certificate.descriptionEn = descriptionEn ?? certificate.descriptionEn;
    certificate.descriptionAr = descriptionAr ?? certificate.descriptionAr;

    if (relatedProjects !== undefined) {
      certificate.relatedProjects = parseJsonField(relatedProjects);
    }

    if (req.files && req.files.logo) certificate.logoUrl = req.files.logo[0].path;
    if (req.files && req.files.certificateImage) certificate.certificateImageUrl = req.files.certificateImage[0].path;

    const updatedCertificate = await certificate.save();
    res.json(updatedCertificate);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل الشهادة', error: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'الشهادة غير موجودة' });
    await certificate.deleteOne();
    res.json({ message: 'تم حذف الشهادة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في حذف الشهادة', error: error.message });
  }
};

module.exports = { getCertificates, getCertificateById, createCertificate, updateCertificate, deleteCertificate };