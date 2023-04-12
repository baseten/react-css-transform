module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,ts,jsx,tsx}'],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 85,
      functions: 100,
      lines: 95,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['raf/polyfill', '<rootDir>/jest/enzyme-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest/test-bundler.ts'],
  testRegex: '.*\\.test\\.(ts|js|tsx|jsx)$',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
