import { spawn } from 'child_process';
import { TestOptions } from '@srclaunch/types';

export async function run(config: TestOptions, match?: string) {
  try {
    const concurrencyArg = config?.concurrency
      ? ['--concurrency', config.concurrency.toString()]
      : [];
    const failFast = config?.failFast ? ['--fail-fast'] : [];
    const failNoTests = config?.failNoTests ? ['--failWithoutAssertions'] : [];
    const matchFlag = match ? [`--match=${match.toString()}`] : [];
    const verbose = config?.verbose ? ['--verbose'] : [];

    const process = spawn('ava', [
      ...concurrencyArg,
      ...failFast,
      ...failNoTests,
      ...matchFlag,
      ...verbose,
    ]);

    process.stdout.on('data', data => {
      console.log(data);
    });

    process.stderr.on('data', data => {
      console.log(data);
    });

    // console.log('process', process);
  } catch (err) {
    console.error(err);
  }
}
