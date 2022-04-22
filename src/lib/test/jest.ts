import { TestOptions } from '@srclaunch/types';
import { run as runJest } from 'jest-cli';
import path from 'path';

export async function run(config: TestOptions, match?: string) {
  try {
    const jestConfig = {
      bail: config?.failFast,
      maxConcurrency: config.concurrency ?? 5,
    };
    // const concurrencyArg = config?.concurrency
    //   ? ['--concurrency', config.concurrency.toString()]
    //   : [];
    // const failFast = config?.failFast ? ['bail', true] : [];
    // const failNoTests = config?.failNoTests ? ['--failWithoutAssertions'] : [];
    // const matchFlag = match ? [`--match=${match.toString()}`] : [];
    // const verbose = config?.verbose ? ['--verbose'] : [];
    // const process = spawn('ava', [
    //   ...concurrencyArg,s
    //   ...failFast,
    //   ...failNoTests,
    //   ...matchFlag,
    //   ...verbose,
    // ]);

    await runJest(jestConfig as any, path.resolve());
  } catch (err) {
    console.error(err);
  }
}
