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
import { Command, CommandType } from '../lib/command.js';
import chalk from 'chalk';
import { readFile } from '../lib/file-system.js';
import ora from 'ora';
import { getBranchName, push } from '../lib/git.js';
import { shellExec } from '../lib/cli.js';
import { getPublishYml } from '../lib/project/publish.js';
import { getPackageScripts } from '../lib/project/package.js';
import {
  getDependencies,
  getDevDependencies,
} from '../lib/project/dependencies.js';
import {
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_LICENSE,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_TYPE,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../constants/project.js';
import { writeToolingConfiguration } from '../lib/project/tooling.js';
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
import { generateGitIgnoreConfig } from '../lib/generators/config/git/gitignore.js';
import { BUILD_DIR, BUILD_FILE_NAME } from '../constants/build.js';

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
            `Setting up ${chalk.bold(config.name)} from SrcLaunch config...`,
          ),
        });

        try {
          const build = Boolean(config.build) ?? Boolean(flags['build']);
          const test = Boolean(config.test) ?? Boolean(flags['test']);

          spinner.start('Updating dependencies...');
          const existingPackageJSON = await JSON.parse(
            (await readFile('package.json')).toString(),
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
            project: config,
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
            packages: config.requirements?.devPackages,
          });
          const dependencies = await getDependencies({
            packages: config.requirements?.packages,
          });
          const peerDependencies = await getDependencies({
            packages: config.requirements?.peerPackages,
          });

          const packageJSON = await generatePackageJSON({
            name: config.name,
            description: config.description,
            author: 'Steven Bennett <steven@srclaunch.com>',
            version: existingPackageJSON.version ?? '0.0.0',
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
                run: config.run,
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

          await generateFile({
            contents: packageJSON,
            name: 'package',
            extension: 'json',
          });
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

          await generateFile({
            contents: generateGitIgnoreConfig(),
            name: '.gitignore',
          });
          await createChangeset({
            files: ['./.gitignore'],
            message: 'Update .gitignore',
            type: ChangeType.Chore,
          });
          spinner.succeed('Project cache cleaned');

          spinner.start('Initializing Yarn...');
          await generateFile({
            contents: await generateYarnConfig({
              nodeLinker: YarnNodeLinker.NodeModules,
            }),
            extension: 'yml',
            name: '.yarnrc',
          });
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

          const updatedPackageJSON = await JSON.parse(
            (await readFile('package.json')).toString(),
          );
          const diff = diffJson(existingPackageJSON, updatedPackageJSON);
          if (diff.length > 1) {
            console.info(chalk.bold('> Changes to package.json:'));
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
          await generateFile({
            contents: getPublishYml({ build, test }),
            extension: 'yml',
            name: 'publish',
            path: '.github/workflows/',
          });
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
            pipelines: config.release?.pipelines,
            publish: config.release?.publish,
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
