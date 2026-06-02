const express = require('express');
const {
  getDomesticPackages,
  getDomesticPackageBySlug,
  getPackageCategories,
  getPackagesByCategory,
  getPopularPackages,
  getBlogs,
  getBlogBySlug,
  getNews,
  getGallery,
  getReviews,
  getCms,
  getCustomPackageCategories,
  getCustomPackages,
  getCustomPackageBySlug,
  getDestinations,
  getDestinationBySlug
} = require('../controller/publicController');

const router = express.Router();

router.get('/domestic', getDomesticPackages);
router.get('/domestic/:slug', getDomesticPackageBySlug);
router.get('/package-categories', getPackageCategories);
router.get('/packages-by-category/:slug', getPackagesByCategory);
router.get('/popular-packages', getPopularPackages);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/news', getNews);
router.get('/gallery', getGallery);
router.get('/reviews', getReviews);
router.get('/cms', getCms);
router.get('/custom-packages/categories', getCustomPackageCategories);
router.get('/custom-packages', getCustomPackages);
router.get('/custom-packages/:slug', getCustomPackageBySlug);
router.get('/destinations', getDestinations);
router.get('/destinations/:slug', getDestinationBySlug);

module.exports = router;
