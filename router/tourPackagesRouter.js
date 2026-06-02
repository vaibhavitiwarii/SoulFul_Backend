const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  createTour,
  getAllTours,
  getTourBySlug,
  updateTour,
  deleteTour
} = require('../controller/tourPackagesController');

const router = express.Router();

router.post('/', authMiddleware, requireAdmin, createTour);
router.get('/', getAllTours);
router.get('/:slug', getTourBySlug);
router.put('/:id', authMiddleware, requireAdmin, updateTour);
router.delete('/:id', authMiddleware, requireAdmin, deleteTour);

module.exports = router;