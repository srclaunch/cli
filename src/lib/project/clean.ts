import path from 'path';
import { deleteDirectory, deleteFile, writeFile } from '@srclaunch/logic';

export async function cleanDependencies() {
  await deleteDirectory(path.resolve('node_modules'));
  await deleteDirectory(path.resolve('.yarn'));
  await deleteFile(path.resolve('yarn.lock'));
  await writeFile(path.resolve('yarn.lock'), '');
}

export async function cleanBuild() {
  await deleteDirectory(path.resolve('dist'));
}

export async function cleanTestCoverage() {
  await deleteDirectory(path.resolve('coverage'));
}
