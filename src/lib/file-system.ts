import fs, { emptyDir } from 'fs-extra';
import path from 'node:path';

export async function emptyDirectory(directory: string): Promise<void> {
  if (!directory) {
    throw new Error('Directory must be provided');
  }

  if (directory === '/') {
    throw new Error('Cannot empty root directory');
  }

  try {
    await emptyDir(directory);
  } catch (err) {
    throw new Error(`Could not empty directory: ${directory}`);
  }
}

export async function readFile(filePath: string) {
  if (!filePath) {
    throw new Error('File path must be provided');
  }

  try {
    path.join(path.resolve(), '.srclaunch', 'config.json');

    return await fs.readFile(filePath);
  } catch (err) {
    throw new Error(`Could not read file: ${filePath}`);
  }
}
