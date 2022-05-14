import fs, { emptyDir } from 'fs-extra';

export async function createDirectory(directory: string): Promise<void> {
  if (!directory) {
    throw new Error('Directory must be provided');
  }

  if (directory === '/') {
    throw new Error('Cannot create root directory');
  }

  try {
    await fs.mkdirs(directory);
  } catch (err) {
    throw new Error(`Could not create directory: ${directory}`);
  }
}

export async function deleteDirectory(directory: string): Promise<void> {
  if (!directory) {
    throw new Error('Directory must be provided');
  }

  if (directory === '/') {
    throw new Error('Cannot delete root directory');
  }

  try {
    await fs.remove(directory);
  } catch (err) {
    throw new Error(`Could not delete directory: ${directory}`);
  }
}

export async function deleteFile(file: string): Promise<void> {
  if (!file) {
    throw new Error('File must be provided');
  }

  if (file === '/') {
    throw new Error('Cannot delete root directory');
  }

  try {
    await fs.remove(file);
  } catch (err) {
    throw new Error(`Could not delete file: ${file}`);
  }
}

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

export async function ensureDirectoryExists(directory: string): Promise<void> {
  if (!directory) {
    throw new Error('Directory must be provided');
  }

  if (directory === '/') {
    throw new Error('Cannot ensure root directory exists');
  }

  try {
    await fs.ensureDir(directory);
  } catch (err) {
    throw new Error(`Could not ensure directory exists: ${directory}`);
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

export async function readFile(filePath: string) {
  if (!filePath) {
    throw new Error('File path must be provided');
  }

  try {
    const fileContents = await fs.readFile(filePath);
    return fileContents;
  } catch (err) {
    throw new Error(`Could not read file: ${filePath}`);
  }
}

export async function writeFile(filePath: string, data: string) {
  if (!filePath) {
    throw new Error('File path must be provided');
  }

  try {
    return await fs.writeFile(filePath, data);
  } catch (err) {
    throw new Error(`Could not write file: ${filePath}`);
  }
}
