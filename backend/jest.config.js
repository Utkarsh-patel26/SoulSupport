module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/app.js",
    "!src/**/*.model.js",
    "!src/utils/**",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  setupFiles: ["<rootDir>/tests/setup.js"],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
};
