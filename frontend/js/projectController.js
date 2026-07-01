const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

// GET /api/projects
// يرجع كل المشاريع المنشورة - دي اللي تظهر في صفحة Projects العامة
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب المشاريع', error: error.message });
  }
};

// GET /api/projects/all
// يرجع كل المشاريع (منشورة وغير منشورة) - للأدمن فقط
const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب المشاريع', error: error.message });
  }
};

// GET /api/projects/:id
// يرجع تفاصيل مشروع واحد - لصفحة project-details.html
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'المشروع غير موجود' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب المشروع', error: error.message });
  }
};

// POST /api/projects
// إضافة مشروع جديد - من لوحة الأدمن فقط
const createProject = async (req, res) => {
  try {
    const { title, description, shortDescription, category, technologies, githubLink, liveLink, order, published, fullDetails } = req.body;

    // الصورة بتيجي من multer وبتكون متخزنة في req.file
    const imageUrl = req.file ? req.file.filename : '';

    if (!imageUrl) {
      return res.status(400).json({ message: 'صورة المشروع مطلوبة' });
    }

    // fullDetails بييجي كـ JSON string من FormData (لو موجود)، فنحوله لـ object
    let parsedFullDetails = {};
    if (fullDetails) {
      try {
        parsedFullDetails = typeof fullDetails === 'string' ? JSON.parse(fullDetails) : fullDetails;
      } catch (e) {
        parsedFullDetails = {};
      }
    }

    const project = await Project.create({
      title,
      description,
      shortDescription,
      category,
      // technologies بتيجي كنص "Python,TensorFlow" فنحولها لـ array
      technologies: technologies ? technologies.split(',').map((t) => t.trim()) : [],
      githubLink,
      liveLink,
      imageUrl,
      order: order || 0,
      published: published !== undefined ? published === 'true' || published === true : true,
      fullDetails: parsedFullDetails,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة المشروع', error: error.message });
  }
};

// PUT /api/projects/:id
// تعديل مشروع موجود - من لوحة الأدمن فقط
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'المشروع غير موجود' });
    }

    const { title, description, shortDescription, category, technologies, githubLink, liveLink, order, published, fullDetails } = req.body;

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.shortDescription = shortDescription ?? project.shortDescription;
    project.category = category ?? project.category;
    project.githubLink = githubLink ?? project.githubLink;
    project.liveLink = liveLink ?? project.liveLink;
    project.order = order ?? project.order;
    project.published = published !== undefined ? published === 'true' || published === true : project.published;

    if (technologies) {
      project.technologies = technologies.split(',').map((t) => t.trim());
    }

    if (fullDetails) {
      try {
        project.fullDetails = typeof fullDetails === 'string' ? JSON.parse(fullDetails) : fullDetails;
      } catch (e) {
        // لو فشل الـ parsing، نسيب fullDetails القديمة كما هي
      }
    }

    // لو الأدمن رفع صورة جديدة، نحذف القديمة ونحدث الاسم
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', project.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      project.imageUrl = req.file.filename;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل المشروع', error: error.message });
  }
};

// DELETE /api/projects/:id
// حذف مشروع - من لوحة الأدمن فقط
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'المشروع غير موجود' });
    }

    // نحذف صورة المشروع من السيرفر كمان عشان ما تفضلش مساحة ضايعة
    const imagePath = path.join(__dirname, '..', 'uploads', project.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await project.deleteOne();
    res.json({ message: 'تم حذف المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في حذف المشروع', error: error.message });
  }
};

module.exports = {
  getProjects,
  getAllProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};