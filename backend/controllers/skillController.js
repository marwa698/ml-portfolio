const Skill = require('../models/Skill');

// GET /api/skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب المهارات', error: error.message });
  }
};

// POST /api/skills
const createSkill = async (req, res) => {
  try {
    const { name, icon, proficiency, category, order } = req.body;

    const skill = await Skill.create({
      name,
      icon,
      proficiency,
      category,
      order: order || 0,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة المهارة', error: error.message });
  }
};

// PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'المهارة غير موجودة' });
    }

    const { name, icon, proficiency, category, order } = req.body;

    skill.name = name ?? skill.name;
    skill.icon = icon ?? skill.icon;
    skill.proficiency = proficiency ?? skill.proficiency;
    skill.category = category ?? skill.category;
    skill.order = order ?? skill.order;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل المهارة', error: error.message });
  }
};

// DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'المهارة غير موجودة' });
    }

    await skill.deleteOne();
    res.json({ message: 'تم حذف المهارة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في حذف المهارة', error: error.message });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};