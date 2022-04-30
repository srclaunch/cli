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
import path from 'path';

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
    const configArg = ['--config', 'node_modules/@srclaunch/dx/ava.config'];
    const failFast = config?.fail?.fast ? ['--fail-fast'] : [];
    const failWithNoTests =
      config?.fail?.noTests ?? DEFAULT_TEST_OPTIONS.fail.noTests
        ? []
        : ['--failWithoutAssertions'];
    const matchFlag = match ? [`--match='${match.toString()}'`] : [];
    // const tapReporter = ['--tap'];
    const verbose = config?.verbose ? ['--verbose'] : [];
    const watchFlag = watch ? ['--watch'] : [];

    const args = [
      ...all,
      ...color,
      ...concurrencyArg,
      ...configArg,
      ...failFast,
      ...failWithNoTests,
      ...matchFlag,
      ...verbose,
      ...watchFlag,
    ];

    console.log(args);

    const childProcess = await spawn('ava', args, {
      stdio: [process.stdin, process.stdout, process.stderr],
    });

    await onExit(childProcess);

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
    // console.error('ERR; ', err);
  }
}
