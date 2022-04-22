import { TestOptions } from '@srclaunch/types';
import { run as runJest } from 'jest-cli';
import path from 'path';

export async function run(config: TestOptions, match?: string) {
  try {
    const jestConfig = {
      bail: config?.failFast,
      coveragePathIgnorePatterns: ['/src/tests/**'],
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      failWithoutAssertions: config?.failNoTests,
      match,
      maxConcurrency: config.concurrency ?? 5,
      rootDir: path.resolve(process.cwd()),
      testPathIgnorePatterns: ['/src/tests/**'],
      verbose: config.verbose ?? true,
    };

    await runJest(jestConfig as any, path.resolve());
  } catch (err) {
    console.error(err);
  }
}
