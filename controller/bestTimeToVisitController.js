const BestTimeToVisit = require('../models/bestTimeToVisitModel');
const VisitMonth = require('../models/bestTimeVisitMonthModel');
const BestTimeDestination = require('../models/bestTimeDestinationModel');
const BestTimeTourPackage = require('../models/bestTimeTourPackageModel');

// BestTimeToVisit
exports.createSeason = async (req, res) => {
  const season = new BestTimeToVisit(req.body);
  await season.save();
  res.status(201).json(season);
};

exports.getAllSeasons = async (req, res) => {
  const seasons = await BestTimeToVisit.find().populate('months');
  res.json(seasons);
};

// VisitMonth
exports.createMonth = async (req, res) => {
  const month = new VisitMonth(req.body);
  await month.save();
  res.status(201).json(month);
};

exports.getAllMonths = async (req, res) => {
  const months = await VisitMonth.find().populate('destinations');
  res.json(months);
};

// Destination
exports.createDestination = async (req, res) => {
  const destination = new BestTimeDestination(req.body);
  await destination.save();
  res.status(201).json(destination);
};

exports.getAllDestinations = async (req, res) => {
  const destinations = await BestTimeDestination.find().populate('tourPackages');
  res.json(destinations);
};

// TourPackage
exports.createTourPackage = async (req, res) => {
  const tour = new BestTimeTourPackage(req.body);
  await tour.save();
  res.status(201).json(tour);
};

exports.getAllPackages = async (req, res) => {
  const packages = await BestTimeTourPackage.find().populate('destination');
  res.json(packages);
};
