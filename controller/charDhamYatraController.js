const TourOfIndiaCategory = require('../models/tourOfIndiaCategoryModel');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await TourOfIndiaCategory.find({ isActive: true });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await TourOfIndiaCategory.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = new TourOfIndiaCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category', details: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await TourOfIndiaCategory.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category', details: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await TourOfIndiaCategory.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
