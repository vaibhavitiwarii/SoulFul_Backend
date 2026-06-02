/**
 * Tour Package Firebase Model
 * Example of how to use Firestore for tour packages
 */

const {
  createDocument,
  getDocument,
  getAllDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument,
} = require('../utils/firebaseUtils');

const COLLECTION = 'tourPackages';

// Create new tour package
const createTourPackage = async (packageData) => {
  return await createDocument(COLLECTION, packageData);
};

// Get single tour package
const getTourPackage = async (packageId) => {
  return await getDocument(COLLECTION, packageId);
};

// Get all tour packages
const getAllTourPackages = async () => {
  return await getAllDocuments(COLLECTION);
};

// Get packages by category
const getTourPackagesByCategory = async (categoryId) => {
  return await queryDocuments(COLLECTION, [['categoryId', '==', categoryId]]);
};

// Get packages by price range
const getTourPackagesByPriceRange = async (minPrice, maxPrice) => {
  return await queryDocuments(COLLECTION, [
    ['price', '>=', minPrice],
    ['price', '<=', maxPrice],
  ]);
};

// Get featured packages
const getFeaturedPackages = async () => {
  return await queryDocuments(COLLECTION, [['featured', '==', true]]);
};

// Update tour package
const updateTourPackage = async (packageId, updateData) => {
  return await updateDocument(COLLECTION, packageId, updateData);
};

// Delete tour package
const deleteTourPackage = async (packageId) => {
  return await deleteDocument(COLLECTION, packageId);
};

module.exports = {
  createTourPackage,
  getTourPackage,
  getAllTourPackages,
  getTourPackagesByCategory,
  getTourPackagesByPriceRange,
  getFeaturedPackages,
  updateTourPackage,
  deleteTourPackage,
};
