import { emptyDir } from 'fs-extra';

export async function emptyDirectory(directory: string): Promise<void> {
  if (!directory) {
    throw new Error('Directory must be provided');
  }

  if (directory === '/') {
    throw new Error('Cannot empty root directory');
  }

  await emptyDir(directory);
}
