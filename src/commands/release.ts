import { ChangeType, Project } from '@srclaunch/types';
import Yaml from 'js-yaml';
import { Command, CommandType } from '../lib/command.js';
import { createRelease } from '../lib/release.js';
import { getBranchName, push } from '../lib/git.js';
import { TypedFlags } from 'meow';
import { InteractiveModeFlag } from '../lib/flags.js';
import { readFile, writeFile } from '../lib/file-system.js';
import path from 'path';
import chalk from 'chalk';
import { createChangeset } from '../lib/changesets.js';

type ReleaseFlags = TypedFlags<
  InteractiveModeFlag & {
    push: {
      alias: 'p';
      default: false;
      description: 'Pushes changes to remote repository';
      isRequired: false;
      type: 'boolean';
    };
  }
>;

export default new Command<Project, ReleaseFlags>({
  name: 'release',
  description: 'Create a release',
  run: async ({ config, flags }) => {
    try {
      const result = await createRelease({
        changesets: config.changesets,
        pipelines: config.release?.pipelines,
        publish: config.release?.publish,
        push: flags.push,
      });

      console.log(
        `${chalk.green('✔')} created release ${chalk.bold(result.version)} ${
          flags.push ? `and pushed to ${chalk.bold(result.repo)}` : ``
        } on branch ${chalk.bold(result.branch)}`,
      );
    } catch (err) {
      console.error('err', err);
    }
  },
  type: CommandType.Project,
  commands: [
    new Command<Project, ReleaseFlags>({
      name: 'help',
      description: 'Shows help for release commands',
      run: async () => {
        console.info('Available release commands are: create, help');
      },
      type: CommandType.Project,
    }),
  ],
});
