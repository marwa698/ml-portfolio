const express = require('express');
const router = express.Router();
const {
  getProjects,
  getAllProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// المسارات العامة - أي زائر يقدر يستخدمها بدون تسجيل دخول
router.get('/', getProjects); // GET /api/projects
router.get('/:id', getProjectById); // GET /api/projects/:id

// المسارات المحمية - للأدمن فقط، لازم توكن صحيح
router.get('/admin/all', protect, getAllProjectsAdmin); // GET /api/projects/admin/all
router.post('/', protect, upload.single('image'), createProject); // POST /api/projects
router.put('/:id', protect, upload.single('image'), updateProject); // PUT /api/projects/:id
router.delete('/:id', protect, deleteProject); // DELETE /api/projects/:id

module.exports = router;