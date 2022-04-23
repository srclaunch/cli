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
    exclude: [
      '**/__tests__/**/__helper__/**/*',
      '**/__tests__/**/__helpers__/**/*',
      '**/__tests__/**/__fixture__/**/*',
      '**/__tests__/**/__fixtures__/**/*',
      '**/test/**/helper/**/*',
      '**/test/**/helpers/**/*',
      '**/test/**/fixture/**/*',
      '**/test/**/fixtures/**/*',
      '**/tests/**/helper/**/*',
      '**/tests/**/helpers/**/*',
      '**/tests/**/fixture/**/*',
      '**/tests/**/fixtures/**/*',
    ],
    include: [
      '**/*.spec.js',
      '**/*.test.js',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.test.tsx',
    ],
  },
  tool: TestTool.Ava,
  verbose: true,
};
