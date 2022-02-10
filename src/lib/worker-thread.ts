import path from 'path';
import { Worker } from 'worker_threads';

function getWorkerThreadFile(appType: string): string | null {
  switch (appType) {
    case 'service':
      return 'ts-node-dev.js';
    case 'web-app':
      return 'cra.js';
  }

  return null;
}

export async function startThread({
  name,
  type,
}: {
  name: string;
  type: 'web-app';
}): Promise<Worker> {
  const moduleURL = new URL(import.meta.url);

  const relativeDir = path.dirname(moduleURL.pathname);
  const workerPath = `${relativeDir}/${getWorkerThreadFile(type)}`;

  return new Worker(workerPath, {
    workerData: {
      name,
      type,
    },
  });
}
