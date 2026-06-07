// src/app.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const { ensureSeedAdmin } = require('../controller/adminAuthController');
const { ensureSeedCustomPackages } = require('../controller/customPackageSeed');
const { ensureSeedIndiaTours } = require('../controller/indiaToursSeed');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();
ensureSeedAdmin();
ensureSeedCustomPackages();
ensureSeedIndiaTours();

const app = express();

// Middleware
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        }
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routers
const experiencesRouter = require('../router/experiencesRouter');
const toursOfIndiaRouter = require('../router/tourOfIndiaRouter');
const bestTimeToVisitRouter = require('../router/bestTimeToVisitRouter');
const travelGuideRouter = require('../router/travelGuideRouter');
const enquiryRouter = require('../router/enquiryRouter');
const contactRouter = require('../router/contactRouter');
const adminAuthRouter = require('../router/adminAuthRouter');
const adminDomesticRouter = require('../router/adminDomesticRouter');
const adminBlogRouter = require('../router/adminBlogRouter');
const adminReviewRouter = require('../router/adminReviewRouter');
const adminPackageCategoryRouter = require('../router/adminPackageCategoryRouter');
const adminPopularPackageRouter = require('../router/adminPopularPackageRouter');
const adminNewsRouter = require('../router/adminNewsRouter');
const adminGalleryRouter = require('../router/adminGalleryRouter');
const adminCmsRouter = require('../router/adminCmsRouter');
const adminEnquiryRouter = require('../router/adminEnquiryRouter');
const adminActivityRouter = require('../router/adminActivityRouter');
const adminDestinationRouter = require('../router/adminDestinationRouter');
const adminCustomPackageRouter = require('../router/adminCustomPackageRouter');
const adminStatsRouter = require('../router/adminStatsRouter');
const adminUploadRouter = require('../router/adminUploadRouter');
const publicRouter = require('../router/publicRouter');
const tourPackagesRouter = require('../router/tourPackagesRouter');

// Mount routers
app.use('/api/experiences', experiencesRouter);
app.use('/api/tours-of-india', toursOfIndiaRouter);
app.use('/api/best-time-to-visit', bestTimeToVisitRouter);
app.use('/api/travel-guide', travelGuideRouter);
app.use('/api/enquiry', enquiryRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/domestic', adminDomesticRouter);
app.use('/api/admin/blogs', adminBlogRouter);
app.use('/api/admin/reviews', adminReviewRouter);
app.use('/api/admin/package-categories', adminPackageCategoryRouter);
app.use('/api/admin/popular-packages', adminPopularPackageRouter);
app.use('/api/admin/news', adminNewsRouter);
app.use('/api/admin/gallery', adminGalleryRouter);
app.use('/api/admin/cms', adminCmsRouter);
app.use('/api/admin/enquiries', adminEnquiryRouter);
app.use('/api/admin/activity', adminActivityRouter);
app.use('/api/admin/destinations', adminDestinationRouter);
app.use('/api/admin/custom-packages', adminCustomPackageRouter);
app.use('/api/admin/stats', adminStatsRouter);
app.use('/api/admin/upload', adminUploadRouter);
app.use('/api/public', publicRouter);
app.use('/api/tours', tourPackagesRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});


// Sample route
app.get('/', (req, res) => {
    res.send('🌍 Travel backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
