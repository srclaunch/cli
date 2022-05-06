import { Changeset } from '@srclaunch/types';
import path from 'path';
import { add, commit } from './git';

export async function createChangeset({
  files = [],
  message,
  scope,
  type,
}: Omit<Changeset, 'files' | 'type'> & {
  files: string | string[];
  type: Changeset['type'] | string;
}): Promise<{
  commitMessage: string;
}> {
  const paths =
    typeof files === 'string'
      ? files
      : files.map(file => (file === '.' ? '.' : path.resolve(file))).join(' ');

  await add(paths);

  const commitMessage = `${type}${scope ? `(${scope})` : ''}: ${message}`;
  await commit(commitMessage);

  return {
    commitMessage,
  };
}
