import { Project } from '@srclaunch/types';
import Yaml from 'js-yaml';
import { Command, CommandType } from '../lib/command.js';
import { createRelease } from '../lib/release.js';
import { push } from '../lib/git.js';
import { TypedFlags } from 'meow';
import { InteractiveModeFlag } from '../lib/flags.js';
import { readFile, writeFile } from '../lib/file-system.js';
import path from 'path';

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
  run: async ({ flags }) => {
    try {
      await createRelease();

      const updatedPackageJson = await readFile('./package.json');
      const updatedPackageJsonContents = JSON.parse(
        updatedPackageJson.toString(),
      );
      const yml = Yaml.dump({
        ...updatedPackageJsonContents,
        version: updatedPackageJsonContents.version,
      });
      await writeFile(path.resolve('./package.yml'), yml.toString());

      if (flags.push) {
        await push({ followTags: true });
      }
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
