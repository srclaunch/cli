import { Project } from '@srclaunch/types';
import { Command, CommandType } from '../lib/command.js';

export default new Command({
  name: 'release',
  description: 'Manage releases',
  commands: [
    new Command<Project>({
      name: 'create',
      description: 'Create a release',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'help',
      description: 'Shows help for release commands',
      run: async () => {
        console.info('Available release commands are: create, help');
      },
      type: CommandType.Project,
    }),
  ],
});
