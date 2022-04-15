import { Project } from '@srclaunch/types';
import { Command, CommandType } from '../lib/command';

export default new Command({
  name: 'changesets',
  description: 'Manage changesets',
  commands: [
    new Command<Project>({
      name: 'create',
      description: 'Create a changeset',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'list',
      description: 'List changesets',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'help',
      description: 'Show help for changesets',
      run: async () => {
        console.info('Available changesets commands are: create, list');
      },
      type: CommandType.Project,
    }),
  ],
});
