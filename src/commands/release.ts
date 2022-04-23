import { Project } from '@srclaunch/types';
import standardVersion from 'standard-version';
import Git, { SimpleGit } from 'simple-git';
import { Command, CommandType } from '../lib/command.js';

export default new Command<Project>({
  name: 'release',
  description: 'Create a release',
  run: async ({ config }: { config: Project }) => {
    try {
      const git: SimpleGit = Git();

      const result = await standardVersion({
        noVerify: true,
        infile: 'docs/CHANGELOG.md',
        silent: true,
      });

      console.log('sv result', result);

      await git.push();
    } catch (err) {
      console.error(err);
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
