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
    const failFast = config?.fail?.fast ? ['--bail'] : [];
    const failWithNoTests =
      config?.fail?.noTests ?? DEFAULT_TEST_OPTIONS.fail.noTests
        ? []
        : ['--passWithNoTests'];
    const matchFlag = match ? [`--t ${match.toString()}`] : [];
    // const tapReporter = ['--tap'];
    const preset = ['--preset', 'ts-jest'];
    const rootDir = ['--rootDir', path.resolve(process.cwd())];
    const verbose = config?.verbose ? ['--verbose'] : [];
    const watchFlag = watch ? ['--watch'] : [];

    const args = [
      ...colors,
      ...concurrencyArg,
      ...coverageProvider,
      ...failWithNoTests,
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
