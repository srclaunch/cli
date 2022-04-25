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
    const colors = ['--colors'];
    const concurrencyArg = config?.concurrency
      ? ['--maxConcurrency', config.concurrency?.toString() ?? '5']
      : [];
    const coverageProvider = ['--coverageProvider', 'v8'];
    // const exclude =
    //   config?.files?.exclude ?? DEFAULT_TEST_OPTIONS.files.exclude;
    // const include =
    //   config?.files?.include ?? DEFAULT_TEST_OPTIONS.files.include;
    // const files = [...include].join(' ');
    // const extensionsToTreatAsEsm = ['--extensionsToTreatAsEsm', '.ts .tsx'];
    const failFast = config?.fail?.fast ? ['--bail'] : [];
    const failWithoutAssertions =
      config?.fail?.noTests ?? DEFAULT_TEST_OPTIONS.fail.noTests
        ? ['--failWithoutAssertions']
        : [];
    const matchFlag = match ? [`--t ${match.toString()}`] : [];
    // const tapReporter = ['--tap'];
    const preset = ['--preset', 'ts-jest'];
    const rootDir = ['--rootDir', path.resolve(process.cwd())];
    const verbose = config?.verbose ? ['--verbose'] : [];
    const watchFlag = watch ? ['--watch'] : [];

    const args = [
      // files, // TODO: Figure out how to set the default test path pattern correctly
      ...colors,
      ...concurrencyArg,
      ...coverageProvider,
      ...extensionsToTreatAsEsm,
      ...failWithoutAssertions,
      ...failFast,
      ...matchFlag,
      ...preset,
      ...rootDir,
      ...verbose,
      ...watchFlag,
    ];
    await runJest(args, path.resolve());
  } catch (err) {
    // console.error(err);
  }
}
