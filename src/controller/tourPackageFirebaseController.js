/**
 * Tour Package Firebase Controller
 * Example of Firebase CRUD operations for tour packages
 */

const tourPackageModel = require('../models/tourPackageFirebaseModel');

// Create new tour package
const createTourPackageController = async (req, res) => {
  try {
    const { name, description, price, categoryId, duration, featured } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const packageData = {
      name,
      description,
      price,
      categoryId,
      duration,
      featured: featured || false,
    };

    const packageId = await tourPackageModel.createTourPackage(packageData);

    res.status(201).json({
      message: 'Tour package created successfully',
      id: packageId,
      data: { id: packageId, ...packageData },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating package', error: error.message });
  }
};

// Get all tour packages
const getAllTourPackagesController = async (req, res) => {
  try {
    const packages = await tourPackageModel.getAllTourPackages();
    res.status(200).json({
      message: 'Tour packages retrieved successfully',
      data: packages,
      count: packages.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};

// Get single tour package
const getTourPackageController = async (req, res) => {
  try {
    const { packageId } = req.params;

    const packageData = await tourPackageModel.getTourPackage(packageId);

    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({
      message: 'Tour package retrieved successfully',
      data: packageData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package', error: error.message });
  }
};

// Get packages by category
const getTourPackagesByCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const packages = await tourPackageModel.getTourPackagesByCategory(categoryId);

    res.status(200).json({
      message: 'Packages retrieved successfully',
      data: packages,
      count: packages.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};

// Get featured packages
const getFeaturedPackagesController = async (req, res) => {
  try {
    const packages = await tourPackageModel.getFeaturedPackages();

    res.status(200).json({
      message: 'Featured packages retrieved successfully',
      data: packages,
      count: packages.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};

// Update tour package
const updateTourPackageController = async (req, res) => {
  try {
    const { packageId } = req.params;
    const updateData = req.body;

    // Check if package exists
    const existingPackage = await tourPackageModel.getTourPackage(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await tourPackageModel.updateTourPackage(packageId, updateData);

    res.status(200).json({
      message: 'Tour package updated successfully',
      id: packageId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating package', error: error.message });
  }
};

// Delete tour package
const deleteTourPackageController = async (req, res) => {
  try {
    const { packageId } = req.params;

    // Check if package exists
    const existingPackage = await tourPackageModel.getTourPackage(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await tourPackageModel.deleteTourPackage(packageId);

    res.status(200).json({
      message: 'Tour package deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error: error.message });
  }
};

module.exports = {
  createTourPackageController,
  getAllTourPackagesController,
  getTourPackageController,
  getTourPackagesByCategoryController,
  getFeaturedPackagesController,
  updateTourPackageController,
  deleteTourPackageController,
};
