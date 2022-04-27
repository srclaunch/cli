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

export async function run({
  config,
  environment,
}: {
  config?: WebApplicationRunOptions;
  environment: Environments;
}) {
  try {
    console.log('config', config);
    console.log('environment', environment);
    switch (environment) {
      case Environments.Development:
        const server = await createServer({
          root: path.join(path.resolve()),
        });

        console.log('server', server);

        await server.listen();

        server.printUrls();

        `${chalk.green('✔')} started ${'asd'} in  ${chalk.bold(
          environment,
        )} mode`;
        break;
      default:
    }
  } catch (err: any) {
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}
