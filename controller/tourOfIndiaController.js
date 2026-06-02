const TourCategory = require('../models/tourCategoryModel');
const TourPackage = require('../models/tourPackageModel');

// CATEGORY CRUD

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await TourCategory.find({ isActive: true });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await TourCategory.findOne({
      slug: req.params.categorySlug,
      isActive: true
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new TourCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category', details: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await TourCategory.findOneAndUpdate(
      { slug: req.params.categorySlug },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category', details: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await TourCategory.findOneAndDelete({ slug: req.params.categorySlug });
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// PACKAGE CRUD

exports.createPackage = async (req, res) => {
  try {
    const category = await TourCategory.findOne({ slug: req.params.categorySlug });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const packageData = {
      ...req.body,
      categoryId: category._id,
      categorySlug: category.slug
    };

    const tourPackage = new TourPackage(packageData);
    await tourPackage.save();
    res.status(201).json(tourPackage);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create package', details: err.message });
  }
};

// Get all packages under a category
exports.getPackagesByCategory = async (req, res) => {
  try {
    const packages = await TourPackage.find({
      categorySlug: req.params.categorySlug,
      isActive: true
    });
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

// Get a specific package by slug under a category
exports.getPackageBySlug = async (req, res) => {
  try {
    const pkg = await TourPackage.findOne({
      categorySlug: req.params.categorySlug,
      slug: req.params.packageSlug,
      isActive: true
    });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json(pkg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const updated = await TourPackage.findOneAndUpdate(
      {
        categorySlug: req.params.categorySlug,
        slug: req.params.packageSlug
      },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update package', details: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const deleted = await TourPackage.findOneAndDelete({
      categorySlug: req.params.categorySlug,
      slug: req.params.packageSlug
    });
    if (!deleted) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
};
