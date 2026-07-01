const express = require('express');
const router = express.Router();
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSkills); // GET /api/skills - عام

router.post('/', protect, createSkill); // محمي
router.put('/:id', protect, updateSkill); // محمي
router.delete('/:id', protect, deleteSkill); // محمي

module.exports = router;