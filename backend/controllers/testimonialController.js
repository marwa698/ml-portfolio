const Testimonial = require('../models/Testimonial');

// GET /api/testimonials
const getTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الآراء', error: error.message });
  }
};

// GET /api/testimonials/:id
const getTestimonialById = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'الرأي غير موجود' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الرأي', error: error.message });
  }
};

// POST /api/testimonials
const createTestimonial = async (req, res) => {
  try {
    const { clientName, role, tag, rating, quote, verificationLink, order } = req.body;

    const item = await Testimonial.create({
      clientName,
      role: role || '',
      tag: tag || '',
      rating: rating || 5,
      quote,
      verificationLink: verificationLink || '',
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة الرأي', error: error.message });
  }
};

// PUT /api/testimonials/:id
const updateTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'الرأي غير موجود' });
    }

    const { clientName, role, tag, rating, quote, verificationLink, order } = req.body;

    item.clientName = clientName ?? item.clientName;
    item.role = role ?? item.role;
    item.tag = tag ?? item.tag;
    item.rating = rating ?? item.rating;
    item.quote = quote ?? item.quote;
    item.verificationLink = verificationLink ?? item.verificationLink;
    item.order = order ?? item.order;

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل الرأي', error: error.message });
  }
};

// DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'الرأي غير موجود' });
    }
    await item.deleteOne();
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في الحذف', error: error.message });
  }
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};