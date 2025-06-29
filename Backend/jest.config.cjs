module.exports = {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/**/*.{test,spec}.{js,jsx}'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ]
}; 