import { exec, fork, spawn } from 'child_process';
import { TestOptions } from '@srclaunch/types';
import { DEFAULT_TEST_OPTIONS } from './index';

export async function run({
  config,
  match,
  watch,
}: {
  config: TestOptions;
  match?: string;
  watch?: boolean;
}): Promise<void> {
  try {
    const all = ['--all'];
    const color = ['--color'];
    const concurrencyArg = config?.concurrency
      ? ['--concurrency', config.concurrency.toString()]
      : [];
    const exclude =
      config?.files?.exclude ?? DEFAULT_TEST_OPTIONS.files.exclude;
    const include =
      config?.files?.include ?? DEFAULT_TEST_OPTIONS.files.include;
    const files = [...include, ...exclude.map(e => `!${e}`)].join(' ');
    const failFast = config?.fail?.fast ? ['--fail-fast'] : [];
    const matchFlag = match ? [`--match='${match.toString()}'`] : [];
    // const tapReporter = ['--tap'];
    const verbose = config?.verbose
      ? ['--verbose']
      : [config.verbose ? '--verbose' : ''];
    const watchFlag = watch ? ['--watch'] : [];

    const args = [
      files,
      ...all,
      ...color,
      ...concurrencyArg,
      ...failFast,
      ...matchFlag,
      ...verbose,
      ...watchFlag,
    ];

    console.log('args', args);

    const process = fork('ava', args);

    if (process) {
      process.stdout?.on('data', data => {
        console.log(data.toString());
      });

      process.stderr?.on('data', data => {
        console.log(data.toString());
      });

      process.on('exit', code => {
        console.log(`child process exited with code ${code}`);
      });

      process.on('error', err => {
        console.log(`child process error: ${err}`);
      });

      process.on('close', () => {
        console.log('child process closed');
      });

      process.on('disconnect', () => {
        console.log('child process disconnected');
      });

      process.on('message', message => {
        console.log(`child process message: ${message}`);
      });
    }
  } catch (err) {
    console.error(err);
  }
}
