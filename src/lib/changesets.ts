import { Changeset } from '@srclaunch/types';
import chalk from 'chalk';
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

  const commitMessage = `${type}${scope ? `(${scope})` : ''}: ${message}`;
  await commit(commitMessage);

  console.log(
    `${chalk.green('✔')} added changeset ${chalk.bold(commitMessage)}}`,
  );
}
