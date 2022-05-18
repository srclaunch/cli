import { Environments, Project, RunnerOptions, Runner } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { Command, CommandType } from '../lib/command.js';
import { run as runVite } from '../lib/run/vite';
import chalk from 'chalk';

type RunFlags = TypedFlags<{
  ssr: {
    default: false;
    description: 'Serve web application using server-side rendering';
    type: 'boolean';
  };
}>;

export default new Command<Project, RunFlags>({
  name: 'run',
  description: 'Commands for running an application or service',
  run: async ({ config, flags }) => {},
  type: CommandType.Project,
  commands: [
    new Command<Project, RunFlags>({
      name: 'dev',
      description: 'Start project in development mode',
      run: async ({ config, flags }) => {
        const options = config.environments?.development?.run as RunnerOptions;

        if (!options) {
          throw new Error('Missing development configuration');
        }

        switch (options?.runner) {
          case Runner.Vite:
            await runVite({
              environment: Environments.Development,
              options,
              project: config,
              // ssr: options.ssr ?? flags.ssr,
            });
            break;
          default:
            console.error(
              `${chalk.red('✘')} ${chalk.bold(
                'Unsupported run tool',
              )} ${chalk.bold(options?.runner)}`,
            );
            break;
        }
      },
      type: CommandType.Project,
    }),
    new Command<Project, RunFlags>({
      name: 'preview',
      description: 'Start project in preview mode',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project, RunFlags>({
      name: 'qa',
      description: 'Start project in qa mode',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project, RunFlags>({
      name: 'production',
      description: 'Start project in production mode',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project, RunFlags>({
      name: 'help',
      description: 'Shows help for run commands',
      run: async () => {
        console.info(
          'Available serve commands are: dev, preview, production, and help',
        );
      },
      type: CommandType.Project,
    }),
  ],
});
