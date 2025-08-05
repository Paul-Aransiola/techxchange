module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1, 
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
};
