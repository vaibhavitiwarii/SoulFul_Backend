/**
 * Tour Package Firebase Router
 * Example routes for Firebase CRUD operations
 */

const express = require('express');
const router = express.Router();

const {
  createTourPackageController,
  getAllTourPackagesController,
  getTourPackageController,
  getTourPackagesByCategoryController,
  getFeaturedPackagesController,
  updateTourPackageController,
  deleteTourPackageController,
} = require('../controller/tourPackageFirebaseController');

// Public routes
router.get('/', getAllTourPackagesController);
router.get('/featured', getFeaturedPackagesController);
router.get('/category/:categoryId', getTourPackagesByCategoryController);
router.get('/:packageId', getTourPackageController);

// Admin routes (add authentication middleware)
router.post('/', createTourPackageController);
router.put('/:packageId', updateTourPackageController);
router.delete('/:packageId', deleteTourPackageController);

module.exports = router;
