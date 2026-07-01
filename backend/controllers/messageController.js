const Message = require('../models/Message');

// POST /api/messages
// ده اللي بيستخدمه أي زائر لما يبعت من صفحة Contact - مفتوح للجميع بدون حماية
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, body } = req.body;

    if (!name || !email || !subject || !body) {
      return res.status(400).json({ message: 'كل الحقول مطلوبة' });
    }

    const message = await Message.create({ name, email, subject, body });
    res.status(201).json({ message: 'تم إرسال رسالتك بنجاح، هتم الرد عليك قريباً', data: message });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إرسال الرسالة', error: error.message });
  }
};

// GET /api/messages
// محمي - بيظهر كل الرسائل في لوحة الأدمن
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب الرسائل', error: error.message });
  }
};

// PUT /api/messages/:id/read
// محمي - بيعلم الرسالة كمقروءة
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    message.isRead = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ', error: error.message });
  }
};

// DELETE /api/messages/:id
// محمي - حذف رسالة من لوحة الأدمن
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    await message.deleteOne();
    res.json({ message: 'تم حذف الرسالة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في حذف الرسالة', error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};