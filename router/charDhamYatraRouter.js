const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controller/tourOfIndiaCategoryController');

// Get all categories
router.get('/', getAllCategories);

// Get a specific category by slug
router.get('/:slug', getCategoryBySlug);

// Create a new category
router.post('/', createCategory);

// Update a category by slug
router.put('/:slug', updateCategory);

// Delete a category by slug
router.delete('/:slug', deleteCategory);

module.exports = router;
