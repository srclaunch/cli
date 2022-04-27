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
import react from '@vitejs/plugin-react';

export async function run({
  options,
  environment,
}: {
  options?: WebApplicationRunOptions[
    | 'development'
    | 'preview'
    | 'qa'
    | 'production'];
  environment: Environments;
}) {
  try {
    console.log('options', options);
    console.log('environment', environment);
    switch (environment) {
      case Environments.Development:
        const config = {
          build: {
            rollupOptions: {
              external: options?.external ?? [],
            },
          },
          configFile: undefined,
          envPrefix: 'SRCLAUNCH_',
          optimizeDeps: {
            exclude: options?.optimize?.exclude ?? [],
            include: options?.optimize?.include ?? [],
          },
          root: path.join(path.resolve()),
          plugins: [react()],
        };

        console.log('config', config);

        const server = await createServer(config);

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
