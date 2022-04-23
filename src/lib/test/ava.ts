import { spawn } from 'child_process';
import { TestOptions } from '@srclaunch/types';
import chalk from 'chalk';

export async function run(config: TestOptions, match?: string) {
  try {
    const concurrencyArg = config?.concurrency
      ? ['--concurrency', config.concurrency.toString()]
      : [];
    const failFast = config?.failFast ? ['--fail-fast'] : [];
    const failNoTests = config?.failNoTests ? ['--failWithoutAssertions'] : [];
    const files = config?.files ?? ['**/*.test.ts', '**/*.test.tsx'];
    const matchFlag = match ? [`--match=${match.toString()}`] : [];
    const verbose = config?.verbose ? ['--verbose'] : [];

    const process = spawn('ava', [
      files.join(' '),
      ...concurrencyArg,
      ...failFast,
      ...failNoTests,
      ...matchFlag,
      ...verbose,
    ]);

    process.stdout.on('data', data => {
      if (data) chalk(data);
    });

    process.stderr.on('data', data => {
      if (data) chalk(data);
    });

    // console.log('process', process);
  } catch (err) {
    console.error(err);
  }
}
