import { Environment } from '@srclaunch/types';
import chalk from 'chalk';

export type ViteRunOptions = {
  environment?: Environment['id'];
  ssr?: boolean;
};

export async function run({ environment }: ViteRunOptions) {
  `${chalk.green('✔')} started ${'asd'} in  ${chalk.bold(environment)} mode`;
}
