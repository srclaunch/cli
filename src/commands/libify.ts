import { exec, fork, spawn } from 'child_process';
import {
  Environments,
  Project,
  ProjectType,
  RunOptions,
  RunTool,
  WebApplicationRunOptions,
} from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { diffLines } from 'diff';
import { getEnvironment } from '@srclaunch/node-environment';
import { Command, CommandType } from '../lib/command.js';
import { run as runVite } from '../lib/run/vite';
import chalk from 'chalk';
import {
  deleteDirectory,
  deleteFile,
  readFile,
  writeFile,
} from '../lib/file-system.js';
import path from 'path';
import { add, commit, push } from '../lib/git.js';
import { GITIGNORE_CONTENT } from '../constants/git.js';
import { YARNRC_CONTENT } from '../constants/yarn.js';
import { shellExec } from '../lib/cli.js';
import { getPublishYml } from '../lib/libify/publish.js';
import { getPackageJson } from '../lib/libify/package.js';

type LibifyFlags = TypedFlags<{
  build: {
    default: false;
    description: 'The library will only be built, and not tested.';
    type: 'boolean';
  };
  test: {
    default: false;
    description: 'The library includes build and test scripts.';
    type: 'boolean';
  };
}>;

export default new Command<Project, LibifyFlags>({
  name: 'libify',
  description:
    "The libify command cleans a project's cache and configures it with package.json scripts and Github Action workflows.",
  run: async ({ config, flags }) => {
    try {
      const existingPackageMetadata = await JSON.parse(
        await readFile('./package.json').toString(),
      );

      const newPackageMetadata = getPackageJson({
        author: 'Steven Bennett <steven@srclaunch.com>',
        dependencies: {},
        description: '',
        devDependencies: {},
        engines: {},
        files: [],
        license: '',
        main: '',
        module: '',
        name: '',
        peerDependencies: {},
        publishConfig: {},
        scripts: {},
        type: 'module',
        types: '',
        version: '',
      });

      const diff = diffLines(
        existingPackageMetadata.toString(),
        newPackageMetadata.toString(),
      );

      for (const change of diff) {
        if (change.added) {
          console.log('+ ' + chalk.green(change.value));
        }

        if (change.removed) {
          console.log('- ' + chalk.red(change.value));
        }
      }

      // const projectType = config.type;

      // const build = flags['build'];
      // const test = flags['test'];

      // // Clear Yarn cache
      // await deleteDirectory(path.resolve('./node_modules'));
      // await deleteDirectory(path.resolve('./coverage'));
      // await deleteDirectory(path.resolve('./dist'));
      // await deleteDirectory(path.resolve('./.yarn'));
      // await deleteFile(path.resolve('./yarn.lock'));
      // await writeFile(path.resolve('./yarn.lock'), '');
      // await writeFile(path.resolve('./.yarnrc.yml'), YARNRC_CONTENT);

      // await add('./');
      // await commit('Clean project');
      // await push({ followTags: false });

      // await writeFile('./.gitignore', GITIGNORE_CONTENT);

      // await add('./');
      // await commit('Update .gitignore');

      // console.info(`${chalk.green('✔')} project cleaned`);

      // await writeFile(
      //   './.github/workflows/publish.yml',
      //   getPublishYml({ build, test }),
      // );
      // console.info(`${chalk.green('✔')} updated publish workflow`);

      // await shellExec('yarn set version stable');
      // await shellExec('yarn plugin import interactive-tools');
      // await shellExec('yarn plugin import workspace-tools');
      // await shellExec('yarn install');

      // console.info(`${chalk.green('✔')} installed dependencies`);

      // // await shellExec('yarn yui');

      // if (build) {
      //   await shellExec('yarn build');
      // }

      // if (test) {
      //   await shellExec('yarn test');
      // }

      // # yarn install
      // # yarn yui

      // # yarn build
      // # yarn test

      // # yarn qr
    } catch (err: any) {
      console.error(chalk.red(err.message));
      process.exit(1);
    }
  },
  type: CommandType.Project,
  commands: [
    new Command<Project, LibifyFlags>({
      name: 'help',
      description: 'Shows help for the libify commands',
      run: async () => {
        console.info('Available libify commands are: help');
      },
      type: CommandType.Project,
    }),
  ],
});
