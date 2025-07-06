module.exports = {
    // Use Node environment (not jsdom)
    testEnvironment: 'node',
  
    // Match test files in the "tests" folder
    testMatch: ['**/tests/**/*.test.js'],
  
    // Enable test coverage
    collectCoverage: true,
  
    // Output directory for coverage reports
    coverageDirectory: 'coverage',
  
    // Ignore folders/files we don't want in coverage
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/',
      '/db.js',               // DB setup doesn't need coverage
      '/index.js',            // Main entry file (typically glue code)
    ],
  
    // Optional: run setup files (e.g., for global mocks)
    // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
    // Show individual test results
    verbose: true,
  };
  