import { Workspace } from '@srclaunch/types';
import { Command, CommandType } from '../lib/command.js';

export default new Command({
  name: 'infrastructure',
  description: 'Manage infrastructure',
  commands: [
    new Command<Workspace>({
      name: 'deploy',
      description: 'Deploy infrastructure',
      run: async ({ config, flags }) => {},
      type: CommandType.Workspace,
    }),
    new Command<Workspace>({
      name: 'help',
      description: 'Shows help for infrastructure commands',
      run: async () => {
        console.info('Available infrastructure commands are: deploy, help');
      },
      type: CommandType.Workspace,
    }),
  ],
});
