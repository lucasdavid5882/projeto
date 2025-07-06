module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '\\.js$': ['babel-jest', { configFile: './babel.config.testing.js' }]
      },
  };