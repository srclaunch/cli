import { exec } from 'child_process';
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

    await exec(`ava ${args.join(' ')}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      }

      if (stdout) {
        console.log(stdout);
      }

      if (stderr) {
        console.error(stderr);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
