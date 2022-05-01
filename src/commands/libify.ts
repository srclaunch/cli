import { exec, fork, spawn } from 'child_process';
import {
  Environments,
  License,
  Project,
  ProjectType,
  RunOptions,
  RunTool,
  TestTool,
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
import {
  constructPackageJson,
  getPackageScripts,
} from '../lib/libify/package.js';
import {
  getDependencies,
  getDevDependencies,
} from '../lib/libify/dependencies.js';
import { PROJECT_PACKAGE_JSON_EXPORTS } from '../constants/project.js';

type LibifyFlags = TypedFlags<{
  build: {
    default: false;
    description: 'The library will only be built, and not tested.';
    type: 'boolean';
  };
  react: {
    default: false;
    description: 'The library includes React components.';
    type: 'boolean';
  };
  reactRouter: {
    default: false;
    description: 'The library uses React Router.';
    type: 'boolean';
  };
  styledComponents: {
    default: false;
    description: 'The library includes Styled Components.';
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
      const packageJsonContents = await readFile('./package.json');
      console.log('packageJSONContents', packageJsonContents.toString());
      const existingPackageMetadata = await JSON.parse(
        packageJsonContents.toString(),
      );

      let exports = {};
      for (const export_ of config.release?.package?.exports ??
        PROJECT_PACKAGE_JSON_EXPORTS) {
        exports = {
          ...exports,
          [export_.path]: {
            import: export_.import,
            require: export_.require,
          },
        };
      }

      const newPackageMetadata = constructPackageJson({
        author: 'Steven Bennett <steven@srclaunch.com>',
        dependencies: {
          ...(getDependencies(config.requirements?.packages?.production) ?? {}),
        },
        description: config.description,
        devDependencies: {
          ...getDevDependencies({
            ava: config.test?.tool === TestTool.Ava,
            github: config.type === ProjectType.GitHubAction,
            jest: config.test?.tool === TestTool.Jest,
            jestReact: config.test?.tool === TestTool.Jest && flags.react,
            react: flags.react,
            reactRouter: flags.reactRouter,
            styledComponents: flags.styledComponents,
            testCoverage: Boolean(config.test?.coverage),
          }),
          ...(getDependencies(config.requirements?.packages?.development) ??
            {}),
        },
        engines: {
          node: config.requirements?.node ?? '>=16',
        },
        exports,
        files: config.release?.package?.files ?? ['dist', 'package.json'],
        license: config.release?.package?.publish?.license ?? License.MIT,
        name: config.name,
        peerDependencies: {
          ...(getDependencies(config.requirements?.packages?.peers) ?? {}),
        },
        publishConfig: {
          access: config?.release?.package?.publish?.access ?? 'private',
          registry:
            config.release?.package?.publish?.registry ??
            'https://registry.npmjs.org/',
        },
        scripts: {
          ...getPackageScripts({
            build: Boolean(config.build),
            release: Boolean(config.release),
            run: config.run,
            test: Boolean(config.test),
          }),
          ...config.release?.package?.scripts,
        },
        version: existingPackageMetadata.version ?? '0.0.0',
      });
      console.log('newPackageMetadata');
      console.log(newPackageMetadata);

      const diff = diffLines(
        existingPackageMetadata.toString(),
        newPackageMetadata.toString(),
      );

      console.log('diff', diff);
      for (const change of diff) {
        console.log('change', change);
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
