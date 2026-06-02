// routes/experiencesRouter.js
const express = require('express');
const router = express.Router();
const {
  getAllExperiences,
  getExperienceBySlug,
  createExperience,
  updateExperience,
  deleteExperience,
  getSubcategoriesByExperience,
  getSubcategoryBySlug,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controller/experiencesController');

// Experience category routes
router.get('/', getAllExperiences);
router.get('/:experienceSlug', getExperienceBySlug);
router.post('/', createExperience);
router.put('/:experienceSlug', updateExperience);
router.delete('/:experienceSlug', deleteExperience);

// Subcategory routes under a specific experience
router.get('/:experienceSlug/subcategories', getSubcategoriesByExperience);
router.get('/:experienceSlug/:subcategorySlug', getSubcategoryBySlug);
router.post('/:experienceSlug/subcategories', createSubcategory);
router.put('/:experienceSlug/:subcategorySlug', updateSubcategory);
router.delete('/:experienceSlug/:subcategorySlug', deleteSubcategory);

module.exports = router;
