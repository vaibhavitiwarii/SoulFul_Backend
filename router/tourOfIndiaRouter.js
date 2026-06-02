const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getPackagesByCategory,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controller/tourOfIndiaController');

// Categories
router.get('/categories', getAllCategories);
router.get('/categories/:categorySlug', getCategoryBySlug);
router.post('/categories', createCategory);
router.put('/categories/:categorySlug', updateCategory);
router.delete('/categories/:categorySlug', deleteCategory);

// Packages
router.get('/categories/:categorySlug/packages', getPackagesByCategory);
router.get('/categories/:categorySlug/:packageSlug', getPackageBySlug);
router.post('/categories/:categorySlug/packages', createPackage);
router.put('/categories/:categorySlug/:packageSlug', updatePackage);
router.delete('/categories/:categorySlug/:packageSlug', deletePackage);

module.exports = router;
