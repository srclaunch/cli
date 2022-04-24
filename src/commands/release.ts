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
      const currentBranch = await (await git.branchLocal()).current;

      const currentRepo = await (
        await git.getRemotes()
      ).find(remote => remote.name === 'origin');

      await standardVersion({
        noVerify: true,
        infile: 'CHANGELOG.md',
        silent: false,
      });

      console.log(`Pushing release to branch: ${currentBranch}`);

      const result = await git.push(
        currentRepo?.name ?? 'origin',
        currentBranch,
        {
          '--follow-tags': null,
        },
      );

      console.log(`Release successfully to: ${result.repo}`);
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
