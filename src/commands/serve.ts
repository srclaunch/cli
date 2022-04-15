import { Project } from '@srclaunch/types';
import { Command, CommandType } from '../lib/command';

export default new Command<Project>({
  name: 'serve',
  description: 'Commands for serving an application or service',
  run: async ({ config, flags }) => {},
  type: CommandType.Project,
  commands: [
    new Command<Project>({
      name: 'web-app',
      description: 'Serves a Web application project',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'web-service',
      description: 'Serves a Web service project',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'help',
      description: 'Shows help for serve commands',
      run: async () => {
        console.info(
          'Available serve commands are: web-app, web-service, help',
        );
      },
      type: CommandType.Project,
    }),
  ],
});
