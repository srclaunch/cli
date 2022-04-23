import { spawn } from 'child_process';
import { TestOptions } from '@srclaunch/types';
import chalk from 'chalk';
import { DEFAULT_TEST_OPTIONS } from '.';
import path from 'path';

export async function run(config: TestOptions, match?: string) {
  try {
    const all = ['--all'];
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

    const includedFiles = include.join(' ');
    const excludedFiles = exclude.concat(exclude.map(e => `!${e}`));
    const files = [includedFiles, excludedFiles].join(' ');

    const args = [
      files,
      ...all,
      ...concurrencyArg,
      ...failFast,
      ...matchFlag,
      ...verbose,
    ];

    console.log('args', args);
    const process = spawn('ava', args);

    process.stdout.on('data', data => {
      console.log(data.toString());
      if (data) chalk.white(data.toString());
    });

    process.stderr.on('data', data => {
      console.log('Error below');
      console.log(data.toString());
      if (data) chalk.white(data.toString());
    });

    // console.log('process', process);
  } catch (err) {
    console.error(err);
  }
}
