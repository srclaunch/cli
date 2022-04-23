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
      'test.js',
      'src/test.js',
      'source/test.js',
      '**/test-*.js',
      '**/*.spec.js',
      '**/*.test.js',
      '**/test/**/*.js',
      '**/tests/**/*.js',
      '**/__tests__/**/*.js',
    ],
  },
  tool: TestTool.Ava,
  verbose: true,
};
