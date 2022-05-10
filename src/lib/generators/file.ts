import { File } from '@srclaunch/types';
import path from 'path';
import { writeFile } from '../file-system.js';

export async function generateFile(file: File): Promise<string> {
  try {
    if (!file.name) {
      throw new Error('File name is required');
    }

    const fullPath = `${path.resolve(path.join(file.path ?? '', file.name))}${
      file.extension ? `.${file.extension}` : ''
    }`;

    await writeFile(fullPath, file.contents ?? '');

    return fullPath;
  } catch (e) {
    throw e;
  }
}
