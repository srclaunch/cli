import { Project } from '@srclaunch/types';
import { Command, CommandType } from '../lib/command.js';
import { createRelease } from '../lib/release.js';

export default new Command<Project>({
  name: 'release',
  description: 'Create a release',
  run: async () => {
    try {
      await createRelease();
    } catch (err) {
      console.error('err', err);
    }
  },
  type: CommandType.Project,
  commands: [
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
