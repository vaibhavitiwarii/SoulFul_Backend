require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const morgan = require('morgan');
const securityMiddleware = require('./middleware/securityMiddleware');
const sitemapRouter = require('./router/sitemapRouter');

// Initialize Firebase if using Firestore
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mongodb';
if (DATABASE_TYPE === 'firestore') {
  require('./src/config/firebase');
}

const app = express();

// ============= SECURITY & COMPRESSION =============
app.use(securityMiddleware.httpsRedirect);
app.use(securityMiddleware.securityHeaders);
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Compression middleware (gzip)
app.use(compression());

// Logging
app.use(morgan('combined'));

// ============= PARSING & SANITIZATION =============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(securityMiddleware.dataSanitization);
app.use(securityMiddleware.xssProtection);

// ============= CORS & RATE LIMITING =============
app.use(securityMiddleware.corsConfig);
app.use(securityMiddleware.generalLimiter);

// ============= DATABASE CONNECTION =============
// MongoDB connection (optional, only if MONGODB_URI is provided)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
} else {
  console.log(`Using ${DATABASE_TYPE.toUpperCase()} as database`);
}

// ============= ROUTES =============

// Sitemap and robots
app.use('/', sitemapRouter);

// Firebase Routes
if (DATABASE_TYPE === 'firestore') {
  app.use('/api/tour-packages-firebase', require('./src/router/tourPackageFirebaseRouter'));
  console.log('✅ Firebase routes loaded');
}

// API Routes with auth limiter
// app.use('/api/auth', securityMiddleware.authLimiter, require('./router/adminAuthRouter'));
// app.use('/api/admin', securityMiddleware.apiLimiter, require('./router/adminAuthRouter'));
// app.use('/api/packages', securityMiddleware.apiLimiter, require('./router/tourPackagesRouter'));
// app.use('/api/blogs', securityMiddleware.apiLimiter, require('./router/adminBlogRouter'));
// app.use('/api/destinations', securityMiddleware.apiLimiter, require('./router/adminDestinationRouter'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// ============= ERROR HANDLING =============
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(securityMiddleware.errorHandler);

// ============= SERVER START =============
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    if (process.env.MONGODB_URI) {
      mongoose.connection.close(false);
    }
  });
});

module.exports = app;
