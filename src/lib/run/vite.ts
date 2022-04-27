import {
  Environment,
  Environments,
  EnvironmentType,
  RunOptions,
  WebApplicationRunOptions,
} from '@srclaunch/types';
import chalk from 'chalk';
import path from 'path';
import { createServer, ViteDevServer } from 'vite';

export async function run({ environment, ssr }: WebApplicationRunOptions) {
  switch (environment?.type) {
    case EnvironmentType.Development:
      const server = await createServer({
        root: path.join(path.resolve()),
      });

      await server.listen();

      server.printUrls();

      `${chalk.green('✔')} started ${'asd'} in  ${chalk.bold(
        environment.id,
      )} mode`;
      break;
    default:
  }
}
