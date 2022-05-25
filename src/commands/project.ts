import {
  Project,
  ProjectType,
  TestTool,
  CodeFormatterTool,
  CodeLinterTool,
  StaticTypingTool,
  ChangeType,
  Workspace,
  BuildOptions,
} from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { diffJson } from 'diff';
import chalk from 'chalk';
// import { ensureDirectoryExists, readFile } from '../lib/file-system';
import ora from 'ora';
import {
  generateGitIgnoreConfig,
  generateNodePackageManifest,
  generateYarnConfig,
  ensureDirectoryExists,
  readFile,
  writeFile,
  YarnNodeLinker,
} from '@srclaunch/logic';
import { Command, CommandType } from '../lib/command';

import { push } from '../lib/git';
import { shellExec } from '../lib/cli';
import { getPublishYml } from '../lib/project/publish';
import { getPackageScripts } from '../lib/project/package';
import {
  getDependencies,
  getDevDependencies,
} from '../lib/project/dependencies';
import {
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_LICENSE,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_TYPE,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../constants/project';
import { writeToolingConfiguration } from '../lib/project/tooling';
import { createRelease } from '../lib/release';
import { createChangeset } from '../lib/changesets';
import {
  cleanBuild,
  cleanDependencies,
  cleanTestCoverage,
} from '../lib/project/clean';
import { BUILD_DIR, BUILD_FILE_NAME } from '../constants/build';

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
    new Command<Project>({
      name: 'sync',
      description: 'Sync SrcLaunch configuration with project',
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

        const build = Boolean(config.build) ?? Boolean(flags['build']);
        const test = Boolean(config.test) ?? Boolean(flags['test']);
        const spinner = ora({
          discardStdin: true,
          spinner: 'dots',
          text: chalk.cyanBright(
            `Setting up ${chalk.bold(config.name)} from SrcLaunch config...`,
          ),
        });

        try {
          spinner.start('Updating dependencies...');

          const existingPackageManifest = await JSON.parse(
            (await readFile('packageon')).toString(),
          );
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
              ),
          });
          const devDependencies = await getDependencies({
            dev: true,
            packages: [
              ...(config.requirements?.devPackages ?? []),
              ...(config.requirements?.packages ?? []),
              ...(config.requirements?.peerPackages ?? []),
            ],
          });

          const dependencies = await getDependencies({
            packages: config.requirements?.packages ?? [],
          });

          const peerDependencies = await getDependencies({
            packages: config.requirements?.peerPackages ?? [],
          });

          const packageJSON = await generateNodePackageManifest({
            name: config.name,
            description: config.description,
            author: 'Steven Bennett <steven@srclaunch.com>',
            version: existingPackageManifest.version ?? '0.0.0',
            engines: {
              node: config.requirements?.node,
              npm: config.requirements?.npm,
              yarn: config.requirements?.yarn,
            },
            license:
              config.release?.publish?.license ?? PROJECT_PACKAGE_JSON_LICENSE,
            publishConfig: {
              access: config?.release?.publish?.access ?? 'private',
              registry:
                config.release?.publish?.registry ??
                'https://registry.npmjs.org/',
            },
            type: config.package?.type ?? PROJECT_PACKAGE_JSON_TYPE,
            main:
              typeof config?.package?.main === 'undefined'
                ? PROJECT_PACKAGE_JSON_MAIN
                : config.package.main,
            types:
              typeof config?.package?.types === 'undefined'
                ? PROJECT_PACKAGE_JSON_TYPES
                : config.package.types !== null
                ? config.package.types
                : undefined,
            files:
              typeof config.package?.files === 'undefined'
                ? PROJECT_PACKAGE_JSON_FILES
                : config.package.files,
            module:
              typeof config?.package?.module === 'undefined'
                ? PROJECT_PACKAGE_JSON_MODULE
                : config.package.module,
            exports:
              typeof config.package?.exports === 'undefined'
                ? [
                    {
                      path: '.',
                      import: `./${
                        // @ts-ignore // TODO: fix this
                        config.build?.output?.directory ?? BUILD_DIR
                        // @ts-ignore // TODO: fix this
                      }/${config.build?.output?.file ?? BUILD_FILE_NAME}.mjs`,
                      require: `./${
                        // @ts-ignore // TODO: fix this
                        config.build?.output?.directory ?? BUILD_DIR
                      }/${
                        // @ts-ignore // TODO: fix this
                        config.build?.output?.file ?? BUILD_FILE_NAME
                      }.umd.cjs`,
                    },
                  ]
                : config.package?.exports,
            scripts: {
              ...getPackageScripts({
                build: Boolean(config.build) || flags['build'],
                release: Boolean(config.release) || flags['release'],
                run: config.environments?.development?.run,
                test: Boolean(config.test),
              }),
              ...config?.package?.scripts,
            },
            dependencies,
            devDependencies: {
              ...coreDevDependencies,
              ...devDependencies,
            },
            peerDependencies,
          });

          await writeFile('package.json', packageJSON);
          spinner.succeed('Dependencies updated');

          spinner.start('Cleaning project cache...');
          await cleanDependencies();
          await cleanBuild();
          await cleanTestCoverage();
          await createChangeset({
            files: '.',
            message: 'Clean installation cache',
            type: ChangeType.Chore,
          });

          if (flags.push) {
            spinner.start('Pushing changes to remote...');
            const pushResult = await push({ followTags: false });
            spinner.succeed(
              `Changes pushed to ${chalk.bold(
                pushResult.repo,
              )} on branch ${chalk.bold(pushResult.branch)}`,
            );
          }

          await writeFile('.gitignore', generateGitIgnoreConfig());
          await createChangeset({
            files: ['./.gitignore'],
            message: 'Update .gitignore',
            type: ChangeType.Chore,
          });
          spinner.succeed('Project cache cleaned');

          spinner.start('Initializing Yarn...');
          await writeFile(
            '.yarnrc.yml',
            await generateYarnConfig({
              nodeLinker: YarnNodeLinker.NodeModules,
            }),
          );
          await shellExec('corepack enable yarn');
          await shellExec('yarn set version stable');
          await shellExec('yarn plugin import interactive-tools');

          if (
            config.environments?.development?.staticTyping?.includes(
              StaticTypingTool.TypeScript,
            )
          ) {
            await shellExec('yarn plugin import typescript');
          }
          spinner.succeed('Initialized Yarn');

          spinner.start('Installing dependencies...');
          await shellExec('yarn install');
          spinner.succeed('Installed project dependencies');

          const updatedPackageManifest = await JSON.parse(
            (await readFile('packageon')).toString(),
          );
          const diff = diffJson(
            existingPackageManifest,
            updatedPackageManifest,
          );
          if (diff.length > 1) {
            console.info(chalk.bold('> Changes to packageon:'));
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

          /* 
            Create a GitHub Action workflow file based on the project
            configuration.
          */
          spinner.start('Creating GitHub Actions public workflow...');
          await ensureDirectoryExists('.github/workflows');
          await writeFile(
            '.github/workflows/publish.yml',
            getPublishYml({ build, test }),
          );
          spinner.succeed('Added GitHub Actions publish workflow');

          /*
            Create configuration files for linters, formatters and static typing
            tools.
          */
          spinner.start('Creating DX tooling configurations...');
          await writeToolingConfiguration({
            formatters: config.environments?.development?.formatters,
            linters: config.environments?.development?.linters,
            project: config,
            staticTyping: config.environments?.development?.staticTyping,
          });
          spinner.succeed('Created DX tooling configurations');

          if (build) {
            spinner.start('Building project bundle...');
            await shellExec('yarn build');
            spinner.succeed('Project compiled and bundled');
          }

          if (test) {
            spinner.start('Running test suite...');
            await shellExec('yarn test');
            spinner.succeed('Test run complete');
          }

          spinner.start('Creating release...');
          await createChangeset({
            files: '.',
            message: 'Project setup',
            type: ChangeType.Chore,
          });

          const { branch, version } = await createRelease({
            changesets: config.changesets,
          });
          spinner.succeed(`Created release ${version}`);

          if (flags.push) {
            spinner.start(`Pushing release to branch ${chalk.bold(branch)}...`);
            const result = await push({ followTags: true });
            spinner.succeed(
              `Pushed release ${chalk.bold(version)} to ${chalk.bold(
                result.repo,
              )} on branch ${chalk.bold(result.branch)}`,
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
