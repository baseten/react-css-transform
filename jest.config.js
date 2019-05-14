module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 75,
      functions: 80,
      lines: 85,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['raf/polyfill', '<rootDir>/jest/enzyme-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest/test-bundler.js'],
  testRegex: '.*\\.test\\.js$',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
