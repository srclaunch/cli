import { Changeset } from '@srclaunch/types';
import path from 'path';
import { add, commit } from './git';

export async function createChangeset({
  files = [],
  message,
  scope,
  type,
}: Omit<Changeset, 'type'> & {
  type: Changeset['type'] | string;
}) {
  const paths = files.map(file => path.resolve(file)).join(' ');

  await add(paths);

  await commit(`${type}${scope ? `(${scope})` : ''}: ${message}`);
}
