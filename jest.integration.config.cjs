const unit = require('./jest.config.cjs');
module.exports = {
  ...unit.projects[0],
  displayName: 'integration',
  testMatch: ['<rootDir>/apps/codex-poc-api/src/**/*.integration.spec.ts'],
  testPathIgnorePatterns: [],
  collectCoverage: false,
};
