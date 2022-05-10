import {
  License,
  Project,
  ProjectType,
  TestTool,
  CodeFormatterTool,
  CodeLinterTool,
  StaticTypingTool,
  ChangeType,
  Workspace,
} from '@srclaunch/types';

import { TypedFlags } from 'meow';
import { diffJson } from 'diff';
import Yaml from 'js-yaml';
import { Command, CommandType } from '../lib/command.js';
import chalk from 'chalk';
import {
  deleteDirectory,
  deleteFile,
  fileExists,
  readFile,
  writeFile,
} from '../lib/file-system.js';
import path from 'path';
import ora, { Spinner } from 'ora';
import { getBranchName, push } from '../lib/git.js';
import { YARNRC_CONTENT } from '../constants/yarn.js';
import { shellExec } from '../lib/cli.js';
import { getPublishYml } from '../lib/reset/publish.js';
import {
  constructPackageJson,
  getPackageScripts,
} from '../lib/reset/package.js';
import {
  getDependencies,
  getDevDependencies,
} from '../lib/reset/dependencies.js';
import {
  PROJECT_PACKAGE_JSON_ENGINES,
  PROJECT_PACKAGE_JSON_EXPORTS,
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_LICENSE,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_TYPE,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../constants/project.js';
import { writeToolingConfiguration } from '../lib/reset/tooling.js';
import { createRelease } from '../lib/release.js';
import { createChangeset } from '../lib/changesets.js';
import {
  cleanBuild,
  cleanDependencies,
  cleanTestCoverage,
} from '../lib/project/clean.js';
import {
  generateYarnConfig,
  YarnNodeLinker,
} from '../lib/generators/config/package-managers/yarn.js';
import { generateFile } from '../lib/generators/file.js';
import { generatePackageJSON } from '../lib/generators/config/node/package-json.js';
import { sortDependencies } from '../lib/project/dependencies.js';
import { generateGitIgnoreConfig } from '../lib/generators/config/git/gitignore.js';

type ProjectSetupFlags = TypedFlags<{
  build: {
    default: false;
    description: 'The library will only be built, and not tested.';
    type: 'boolean';
  };
  push: {
    alias: 'p';
    default: false;
    description: 'Pushes changes to remote repository';
    isRequired: false;
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
  release: {
    default: false;
    description: 'Add scripts and dependencies for creating project releases.';
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

export default new Command<Workspace & Project>({
  name: 'project',
  description: 'Manage project',
  commands: [
    new Command<Workspace>({
      name: 'create',
      description: 'Create a new SrcLaunch project',
      run: async ({ config, flags }) => {},
      type: CommandType.Workspace,
    }),
    new Command<Project, ProjectSetupFlags>({
      name: 'setup',
      description: 'Setup a project for use with SrcLaunch',
      run: async ({ config, flags }) => {
        if (!config) {
          console.log(chalk.red('No project configuration found'));
        }

        const spinner = ora({
          discardStdin: true,
          spinner: 'dots',
          text: chalk.cyanBright(
            `setting up ${chalk.bold(config.name)} from SrcLaunch config...`,
          ),
        });

        try {
          const build = Boolean(config.build) ?? Boolean(flags['build']);
          const test = Boolean(config.test) ?? Boolean(flags['test']);

          spinner.start('configuring and updating dependencies...');
          const coreDevDependencies = await getDevDependencies({
            ava: config.test?.tool === TestTool.Ava,
            eslint: config.environments?.development?.linters?.includes(
              CodeLinterTool.ESLint,
            ),
            github: config.type === ProjectType.GitHubAction,
            jest: config.test?.tool === TestTool.Jest,
            jestReact:
              config.test?.tool === TestTool.Jest ||
              (flags.react && test) ||
              (config.type === ProjectType.WebApplication && test) ||
              (config.type === ProjectType.ComponentLibrary && test),
            prettier: config.environments?.development?.formatters?.includes(
              CodeFormatterTool.Prettier,
            ),
            react:
              config?.type === ProjectType.WebApplication ||
              config?.type === ProjectType.ComponentLibrary ||
              flags.react,
            reactRouter: flags.reactRouter,
            srclaunch: config?.requirements?.srclaunch,
            styledComponents: flags.styledComponents,
            stylelint: config.environments?.development?.linters?.includes(
              CodeLinterTool.Stylelint,
            ),
            testCoverage: Boolean(config.test?.coverage),
            typescript:
              config?.environments?.development?.staticTyping?.includes(
                StaticTypingTool.TypeScript,
              ) ?? true,
          });
          spinner.succeed('dependencies updated');

          spinner.start('configuring package.json...');
          const existingPackageJsonContents = await JSON.parse(
            (await readFile('./package.json')).toString(),
          );

          const packageJSON = generatePackageJSON({
            author: 'Steven Bennett <steven@srclaunch.com>',
            dependencies: sortDependencies(
              await getDependencies(config.requirements?.packages),
            ),
            description: config.description,
            devDependencies: sortDependencies({
              ...coreDevDependencies,
              ...(await getDependencies(config.requirements?.devPackages)),
            }),
            engines: {
              node:
                config.requirements?.node ?? PROJECT_PACKAGE_JSON_ENGINES.node,
              npm: config.requirements?.npm ?? PROJECT_PACKAGE_JSON_ENGINES.npm,
              yarn:
                config.requirements?.yarn ?? PROJECT_PACKAGE_JSON_ENGINES.yarn,
            },
            exports: config.package?.exports ?? PROJECT_PACKAGE_JSON_EXPORTS,
            files: config.package?.files ?? PROJECT_PACKAGE_JSON_FILES,
            license:
              config.release?.publish?.license ?? PROJECT_PACKAGE_JSON_LICENSE,
            main: config?.package?.main ?? PROJECT_PACKAGE_JSON_MAIN,
            module: config?.package?.module ?? PROJECT_PACKAGE_JSON_MODULE,
            name: config.name,
            peerDependencies: sortDependencies(
              await getDependencies(config.requirements?.peerPackages),
            ),
            publishConfig: {
              access: config?.release?.publish?.access ?? 'private',
              registry:
                config.release?.publish?.registry ??
                'https://registry.npmjs.org/',
            },
            scripts: {
              ...getPackageScripts({
                build: Boolean(config.build) || flags['build'],
                release: Boolean(config.release) || flags['release'],
                run: config.run,
                test: Boolean(config.test),
              }),
              ...config?.package?.scripts,
            },
            types: config.package?.types ?? PROJECT_PACKAGE_JSON_TYPES,
            type: config.package?.type ?? PROJECT_PACKAGE_JSON_TYPE,
            version: existingPackageJsonContents.version ?? '0.0.0',
          });

          const diff = diffJson(existingPackageJsonContents, packageJSON);

          if (diff.length > 0) {
            console.info(chalk.bold('Changes to package.json:'));
            for (const change of diff) {
              if (change.added) {
                console.log(chalk.green.bold(`+ Added: ${change.count}`));
                console.log(chalk.green(`+ ${change.value.toString().trim()}`));
              }

              if (change.removed) {
                console.log(chalk.red.bold(`- Removed: ${change.count}`));
                console.log(chalk.red(`- ${change.value.toString().trim()}`));
              }
            }
          }

          spinner.succeed('package.json configured');

          spinner.start('cleaning project...');
          await cleanDependencies();
          await cleanBuild();
          await cleanTestCoverage();

          await generateFile({
            contents: await generateYarnConfig({
              nodeLinker: YarnNodeLinker.NodeModules,
            }),
            extension: '.yml',
            name: '.yarnrc',
          });

          await createChangeset({
            files: '.',
            message: 'Clean installation cache',
            type: ChangeType.Chore,
          });

          if (flags['push']) {
            await push({ followTags: false });
          }

          await generateFile({
            contents: generateGitIgnoreConfig(),
            name: '.gitignore',
          });

          await createChangeset({
            files: ['./.gitignore'],
            message: 'Update .gitignore',
            type: ChangeType.Chore,
          });

          spinner.succeed('project cleaned');
          // console.info(`${chalk.green('✔')} project cleaned`);

          /* 
            Create a GitHub Action workflow file based on the project
            configuration.
          */
          spinner.start('Creating GitHub Actions public workflow...');
          await writeFile(
            './.github/workflows/publish.yml',
            getPublishYml({ build, test }),
          );
          spinner.succeed('added GitHub Actions publish workflow');

          /*
            Create configuration files for linters, formatters and static typing
            tools.
          */
          spinner.start('creating DX tooling configurations...');
          await writeToolingConfiguration({
            formatters: config.environments?.development?.formatters,
            linters: config.environments?.development?.linters,
            project: config,
            staticTyping: config.environments?.development?.staticTyping ?? [
              StaticTypingTool.TypeScript,
            ],
          });
          spinner.succeed('created DX tooling configurations');

          spinner.start('initializing Yarn...');
          await shellExec('corepack enable yarn');
          await shellExec('yarn set version stable');

          await shellExec('yarn plugin import interactive-tools');
          await shellExec(
            'yarn plugin import https://raw.githubusercontent.com/lyleunderwood/yarn-plugin-yaml-manifest/master/bundles/%40yarnpkg/plugin-yaml-manifest.js',
          );

          if (
            config.environments?.development?.staticTyping?.includes(
              StaticTypingTool.TypeScript,
            )
          ) {
            await shellExec('yarn plugin import typescript');
          }
          spinner.succeed('initialized Yarn');

          spinner.start('installing dependencies...');
          await shellExec('yarn install');
          spinner.succeed('installed project dependencies');

          if (build) {
            spinner.start('building project bundle...');
            await shellExec('yarn build');
            spinner.succeed('built project bundle');
          }

          if (test) {
            spinner.start('running test suite...');
            await shellExec('yarn test');
            spinner.succeed('test run complete');
          }

          spinner.start('creating release...');
          await createChangeset({
            files: '.',
            message: 'Project setup',
            type: ChangeType.Chore,
          });

          const { branch, version } = await createRelease({
            changesets: config.changesets,
            pipelines: config.release?.pipelines,
            publish: config.release?.publish,
          });
          spinner.succeed(`created release ${version}`);

          if (flags.push) {
            spinner.start(`pushing release to branch ${chalk.bold(branch)}...`);
            const result = await push({ followTags: true });

            spinner.succeed(
              `${chalk.green('✔')} pushed release ${chalk.bold(
                version,
              )} to ${chalk.bold(result.repo)} on branch ${chalk.bold(
                await getBranchName(),
              )}`,
            );
          }
        } catch (err: any) {
          spinner.fail(chalk.red(err));
          process.exit(1);
        }
      },
      type: CommandType.Project,
    }),
    new Command<Workspace>({
      name: 'help',
      description: 'Shows help for projects commands',
      run: async () => {
        console.info('Available projects commands are: create, help');
      },
      type: CommandType.Workspace,
    }),
  ],
});
