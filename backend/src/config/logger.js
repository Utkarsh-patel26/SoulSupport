const winston = require("winston");
const path = require("path");

const logDir = process.env.LOG_DIR || "logs";

// Create logs directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log levels and colors
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
    trace: "gray",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "soulsupport-api" },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),

    // All logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),

    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
  ],
});

// Set log level based on environment
logger.level = process.env.LOG_LEVEL || "info";

module.exports = logger;
