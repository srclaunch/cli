import { Project, ProjectType } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { Command, CommandType } from '../lib/command.js';
import { run as runVite } from '../lib/run/vite';

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
  run: async ({ config, flags }) => {
    const env = process.env.NODE_ENV || 'test';

    switch (config.type) {
      case ProjectType.WebApplication:
        await runVite({ environment: env });
        break;
      default:
        break;
    }
  },
  type: CommandType.Project,
  commands: [
    new Command<Project, RunFlags>({
      name: 'dev',
      description: 'Start project in development mode',
      run: async ({ config, flags }) => {},
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
