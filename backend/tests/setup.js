/**
 * Jest Setup File
 * Configure test environment and global test utilities
 */

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-testing-purposes-only";
process.env.JWT_EXPIRES_IN = "7d";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/soulsupport-test";

// Increase test timeout
jest.setTimeout(10000);

// Global test utilities
global.generateMockId = () => {
  return Math.random().toString(36).substr(2, 9);
};

global.generateMockEmail = () => {
  return `test${Date.now()}@example.com`;
};

// Suppress console logs during tests
if (process.env.DEBUG !== "true") {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
