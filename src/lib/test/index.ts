import { TestOptions, TestReporter, TestTool } from '@srclaunch/types';

export const DEFAULT_TEST_OPTIONS = {
  concurrency: undefined,
  coverage: {
    directory: 'coverage',
    thresholds: {
      global: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      },
    },
    reporters: [TestReporter.Lcov, TestReporter.JSONSummary],
  },
  fail: {
    fast: true,
    noTests: false,
  },
  files: {
    exclude: [],
    include: [
      'src/__tests__/**/*',
      'src/tests/**/*',
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
      'src/**/*.test.js',
      'src/**/*.spec.js',
      'src/**/*.spec.jsx',
    ],
  },
  tool: TestTool.Ava,
  verbose: true,
};
