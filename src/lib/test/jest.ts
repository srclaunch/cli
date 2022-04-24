import { TestOptions } from '@srclaunch/types';
import { run as runJest } from 'jest-cli';
import path from 'path';
import { DEFAULT_TEST_OPTIONS } from '.';

export async function run({
  config,
  match,
  watch,
}: {
  config: TestOptions;
  match?: string;
  watch?: boolean;
}) {
  try {
    const jestConfig = {
      bail: config?.fail?.fast ?? DEFAULT_TEST_OPTIONS.fail.fast,
      coveragePathIgnorePatterns:
        config.files?.include ?? DEFAULT_TEST_OPTIONS.files.include,
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      failWithoutAssertions:
        config?.fail?.noTests ?? DEFAULT_TEST_OPTIONS.fail.noTests,
      match,
      maxConcurrency: config.concurrency ?? 5,
      rootDir: path.resolve(process.cwd()),
      testPathIgnorePatterns:
        config.files?.exclude ?? DEFAULT_TEST_OPTIONS.files.exclude,
      testMatch: config.files?.include ?? DEFAULT_TEST_OPTIONS.files.include,
      verbose: config.verbose ?? true,
      watch: watch ?? false,
    };

    const colors = ['--colors'];
    const concurrencyArg = config?.concurrency
      ? ['--maxConcurrency', config.concurrency?.toString() ?? '5']
      : [];
    const exclude =
      config?.files?.exclude ?? DEFAULT_TEST_OPTIONS.files.exclude;
    const include =
      config?.files?.include ?? DEFAULT_TEST_OPTIONS.files.include;
    const files = [...include, ...exclude.map(e => `!${e}`)].join(' ');
    const failFast = config?.fail?.fast ? ['--bail'] : [];
    const matchFlag = match ? [`--t ${match.toString()}`] : [];
    // const tapReporter = ['--tap'];
    const preset = ['--preset', 'ts-jest'];
    const verbose = config?.verbose
      ? ['--verbose']
      : [config.verbose ? '--verbose' : ''];
    const watchFlag = watch ? ['--watch'] : [];

    const args = [
      files,
      ...colors,
      ...concurrencyArg,
      ...failFast,
      ...matchFlag,
      ...preset,
      ...verbose,
      ...watchFlag,
    ];
    await runJest(args, path.resolve());
  } catch (err) {
    console.error(err);
  }
}
