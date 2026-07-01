const Project = require('../models/Project');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب المشاريع', error: error.message });
  }
};

// GET /api/projects/all
const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في جلب المشاريع', error: error.message });
  }
};

// GET /api/projects/:id
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
const createProject = async (req, res) => {
  try {
    const { title, description, shortDescription, category, technologies, githubLink, liveLink, order, published } = req.body;

    // بعد Cloudinary، الرابط الكامل للصورة بيكون في req.file.path
    const imageUrl = req.file ? req.file.path : '';

    if (!imageUrl) {
      return res.status(400).json({ message: 'صورة المشروع مطلوبة' });
    }

    const project = await Project.create({
      title,
      description,
      shortDescription,
      category,
      technologies: technologies ? technologies.split(',').map((t) => t.trim()) : [],
      githubLink,
      liveLink,
      imageUrl,
      order: order || 0,
      published: published !== undefined ? published : true,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في إضافة المشروع', error: error.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'المشروع غير موجود' });
    }

    const { title, description, shortDescription, category, technologies, githubLink, liveLink, order, published } = req.body;

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.shortDescription = shortDescription ?? project.shortDescription;
    project.category = category ?? project.category;
    project.githubLink = githubLink ?? project.githubLink;
    project.liveLink = liveLink ?? project.liveLink;
    project.order = order ?? project.order;
    project.published = published !== undefined ? published : project.published;

    if (technologies) {
      project.technologies = technologies.split(',').map((t) => t.trim());
    }

    // لو الأدمن رفع صورة جديدة، بس نستبدل الرابط (القديمة هتفضل على Cloudinary، مش هتتحذف تلقائيًا)
    if (req.file) {
      project.imageUrl = req.file.path;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'حصل خطأ في تعديل المشروع', error: error.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'المشروع غير موجود' });
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