import { exec, fork, spawn } from 'child_process';
import { TestOptions } from '@srclaunch/types';
import { DEFAULT_TEST_OPTIONS } from './index';
import {
  chunksToLinesAsync,
  streamWrite,
  streamEnd,
  onExit,
} from '@rauschma/stringio';
import { Readable, Writable } from 'stream';

async function transform(readable: Readable, writable: Writable) {
  for await (const line of chunksToLinesAsync(readable)) {
    await streamWrite(writable, '@ ' + line);
  }
  await streamEnd(writable);
}

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

    const source = spawn('ava', args, {
      stdio: ['ignore', 'pipe', process.stderr],
    });
    const sink = spawn('ava', args, {
      stdio: ['pipe', process.stdout, process.stderr],
    });

    transform(source.stdout, sink.stdin);
    await onExit(sink);

    // if (process) {
    //   process.stdout?.on('data', data => {
    //     console.log(data.toString());
    //   });

    //   process.stderr?.on('data', data => {
    //     console.log(data.toString());
    //   });

    //   process.on('exit', code => {
    //     console.log(`child process exited with code ${code}`);
    //   });

    //   process.on('error', err => {
    //     console.log(`child process error: ${err}`);
    //   });

    //   process.on('close', () => {
    //     console.log('child process closed');
    //   });

    //   process.on('disconnect', () => {
    //     console.log('child process disconnected');
    //   });

    //   process.on('message', message => {
    //     console.log(`child process message: ${message}`);
    //   });
    // }
  } catch (err) {
    console.error(err);
  }
}
