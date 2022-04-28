import {
  spawn,
  // exec,
} from 'child_process';
// import { readFile } from 'fs/promises';
import fs from 'fs-extra';
// import { nanoid } from 'nanoid';
import path from 'path';
// import React from 'react';
import { parentPort, workerData } from 'worker_threads';
// import { getServiceDirByType } from './applab.js';

const __dirname = path.resolve();
// const srcPath =
//   workerData.name && workerData.type
//     ? `${__dirname}/${getServiceDirByType(workerData.type)}/${workerData.name}`
//     : null;
const srcPath = __dirname;

// const destPath = `${srcPath}/.applab/${nanoid()}`;
// const tmpPath = `${srcPath}/.applab/`;

function sendMessage(message: string | number | Error) {
  const messageParts = message.toString().split('\n');

  for (const part of messageParts) {
    const trimmed = part.trim();

    if (parentPort && trimmed !== '') parentPort.postMessage(trimmed);
  }
}

if (srcPath) {
  sendMessage(`Starting CRA app in ${srcPath}`);

  fs.ensureDirSync(srcPath);

  const process = spawn('react-scripts', ['start'], {
    cwd: srcPath,
    stdio: 'pipe',
  });

  process.on('message', message => {
    console.log('messag1', message.toString());
    sendMessage(message.toString());
  });

  process.stdout.on('data', message => {
    console.log('message', message.toString());
    sendMessage(message.toString());
  });

  process.stderr.on('error', err => {
    sendMessage('Error!');
    sendMessage(err);
  });

  process.on('exit', (code, signal) => {
    sendMessage(`Exiting with code=${code} signal=${signal}`);
  });

  process.on('close', (code, signal) => {
    sendMessage(`Closing with code=${code} signal=${signal}`);
  });

  process.on('disconnect', () => {
    sendMessage(`Disconnecting process ${workerData.name}`);
  });

  process.on('error', err => {
    sendMessage(err);
  });
}
