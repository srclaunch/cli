import { spawn } from 'child_process';
import { TestOptions } from '@srclaunch/types';
import chalk from 'chalk';
import { DEFAULT_TEST_OPTIONS } from '.';

export async function run(config: TestOptions, match?: string) {
  try {
    const concurrencyArg = config?.concurrency
      ? ['--concurrency', config.concurrency.toString()]
      : [];
    const failFast = config?.fail?.fast ? ['--fail-fast'] : [];
    const exclude =
      config?.files?.exclude ?? DEFAULT_TEST_OPTIONS.files.exclude;
    const include =
      config?.files?.include ?? DEFAULT_TEST_OPTIONS.files.include;
    const matchFlag = match ? [`--match=${match.toString()}`] : [];
    // const tapReporter = ['--tap'];
    const verbose = config?.verbose
      ? ['--verbose']
      : [config.verbose ? '--verbose' : ''];

    console.log([
      include.join(' '),
      exclude.map(e => `!e`).join(' '),
      ...concurrencyArg,
      ...failFast,
      ...matchFlag,
      ...verbose,
    ]);

    const process = spawn('ava', [
      include.join(' '),
      exclude.map(e => `!e`).join(' '),
      ...concurrencyArg,
      ...failFast,
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
