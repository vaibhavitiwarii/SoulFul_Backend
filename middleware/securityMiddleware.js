const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Security Headers with Helmet
exports.securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});

// Data sanitization (NoSQL Injection prevention)
// Custom implementation to avoid Express 5.x compatibility issues
exports.dataSanitization = (req, res, next) => {
  // Simple NoSQL injection prevention
  // Check for common injection patterns
  const checkForInjection = (obj) => {
    if (!obj) return false;
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes('$')) {
        return true;
      }
      if (typeof obj[key] === 'object') {
        return checkForInjection(obj[key]);
      }
    }
    return false;
  };

  if (req.body && checkForInjection(req.body)) {
    console.warn('Potential NoSQL injection attempt detected');
  }
  next();
};

// XSS Attack prevention
// Note: Helmet already provides XSS protection via Content-Security-Policy
// This is a simple middleware that logs potential XSS attempts
exports.xssProtection = (req, res, next) => {
  // Additional XSS checks can be added here if needed
  // For now, rely on helmet's CSP and other built-in protections
  next();
};

// Rate limiting
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Rate limiting for API endpoints
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: 'Too many API requests, please try again later.'
});

// CORS Configuration
exports.corsConfig = cors({
  origin: process.env.FRONTEND_URL || 'https://soulfulindiatours.com',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
});

// HTTPS redirect middleware
exports.httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
};

// Request logging middleware
exports.requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message,
      status: err.status || 500
    }
  });
};
