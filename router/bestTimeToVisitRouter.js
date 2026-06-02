const express = require('express');
const router = express.Router();
const bestTimeController = require('../controller/bestTimeToVisitController');

// BestTimeToVisit
router.post('/season', bestTimeController.createSeason);
router.get('/season', bestTimeController.getAllSeasons);

// VisitMonth
router.post('/month', bestTimeController.createMonth);
router.get('/month', bestTimeController.getAllMonths);

// Destination
router.post('/destination', bestTimeController.createDestination);
router.get('/destination', bestTimeController.getAllDestinations);

// TourPackage
router.post('/package', bestTimeController.createTourPackage);
router.get('/package', bestTimeController.getAllPackages);

module.exports = router;
