import { Project } from '@srclaunch/types';
import { Command, CommandType } from '../lib/command.js';

export default new Command({
  name: 'preview',
  description:
    'Creates a preview of the production build with currently pending changesets',
  commands: [
    new Command<Project>({
      name: 'start',
      description:
        'Builds a preview of the production build, and serves locally on the port provided in the project configuration file',
      run: async () => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'help',
      description: 'Shows help for preview commands',
      run: async () => {
        console.info('Available preview commands are: help');
      },
      type: CommandType.Project,
    }),
  ],
});
