const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("mongo-sanitize");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

/**
 * Security Middleware Configuration
 */

// Helmet - Set security HTTP headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

// CORS Configuration
const corsConfig = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
});

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.ip === "::1" || req.ip === "127.0.0.1", // Skip localhost
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again after 15 minutes.",
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Data sanitization against NoSQL injections
const mongoSanitizeConfig = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Suspicious data detected in ${key}`);
  },
});

// XSS Protection
const xssProtection = xss();

/**
 * Password validation function
 */
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };

  const isValid = Object.values(requirements).every((req) => req);

  return {
    isValid,
    requirements,
    message: isValid
      ? "Password meets all requirements"
      : `Password must have: ${Object.entries(requirements)
          .filter(([_, passes]) => !passes)
          .map(([req]) =>
            req
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()
              .trim()
          )
          .join(", ")}`,
  };
};

module.exports = {
  helmetConfig,
  corsConfig,
  generalLimiter,
  authLimiter,
  mongoSanitizeConfig,
  xssProtection,
  validatePassword,
};
