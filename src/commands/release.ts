import { Project } from '@srclaunch/types';
import standardVersion from 'standard-version';
import Git, { SimpleGit } from 'simple-git';
import { Command, CommandType } from '../lib/command.js';

export default new Command({
  name: 'release',
  description: 'Manage releases',
  run: async ({ config }: { config: Project }) => {
    try {
      const git: SimpleGit = Git();
      await git.push();
    } catch (err) {
      console.error(err);
    }
  },
  commands: [
    new Command<Project>({
      name: 'create',
      description: 'Create a release',
      run: async ({ config, flags }) => {
        try {
          const git: SimpleGit = Git();
          await git.add('.');
          await git.commit(message);
        } catch (err) {
          console.error(err);
        }
      },
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
