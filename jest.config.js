module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 50,
      functions: 100,
      lines: 90,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['raf/polyfill', '<rootDir>/jest/enzyme-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest/test-bundler.js'],
  testRegex: '.*\\.test\\.js$',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
