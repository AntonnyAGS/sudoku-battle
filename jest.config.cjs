const common = {
  rootDir: __dirname,
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/apps/codex-poc-frontend/.next/',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          ...require('./tsconfig.base.json').compilerOptions,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          jsx: 'react-jsx',
          types: ['node', 'jest', '@testing-library/jest-dom'],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@sudoku/contracts$': '<rootDir>/libs/shared/contracts/src/index.ts',
    '^@sudoku/frontend-application$':
      '<rootDir>/libs/frontend/application/src/index.ts',
    '^@sudoku/frontend-http-adapter$':
      '<rootDir>/libs/frontend/http-adapter/src/index.ts',
    '^server-only$': '<rootDir>/apps/codex-poc-frontend/test/server-only.ts',
  },
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
  coverageReporters: ['text', 'lcov', 'json-summary'],
};
module.exports = {
  projects: [
    {
      ...common,
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/apps/codex-poc-api/src/**/*.spec.ts',
        '<rootDir>/libs/backend/**/src/**/*.spec.ts',
      ],
      testPathIgnorePatterns: ['\\.integration\\.spec\\.ts$'],
      collectCoverageFrom: [
        'apps/codex-poc-api/src/**/*.ts',
        'libs/backend/**/src/**/*.ts',
        '!**/*.spec.ts',
        '!apps/codex-poc-api/src/main.ts',
        '!**/index.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/backend',
    },
    {
      ...common,
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/apps/codex-poc-frontend/test/setup.ts'],
      testMatch: [
        '<rootDir>/apps/codex-poc-frontend/src/**/*.spec.ts',
        '<rootDir>/apps/codex-poc-frontend/src/**/*.spec.tsx',
        '<rootDir>/libs/frontend/**/src/**/*.spec.ts',
      ],
      collectCoverageFrom: [
        'apps/codex-poc-frontend/src/**/*.{ts,tsx}',
        'libs/frontend/**/src/**/*.ts',
        '!**/*.spec.ts',
        '!**/*.spec.tsx',
        '!**/index.ts',
        '!apps/codex-poc-frontend/src/app/page.tsx',
        '!apps/codex-poc-frontend/src/app/layout.tsx',
        '!apps/codex-poc-frontend/src/instrumentation.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/frontend',
    },
    {
      ...common,
      displayName: 'contracts',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/libs/shared/contracts/src/**/*.spec.ts'],
      collectCoverageFrom: [
        'libs/shared/contracts/src/**/*.ts',
        '!**/*.spec.ts',
        '!**/index.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/contracts',
    },
  ],
};
