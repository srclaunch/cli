import {
  License,
  Project,
  ProjectType,
  TestTool,
  CodeFormatterTool,
  CodeLinterTool,
  StaticTypingTool,
} from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { diffJson } from 'diff';
import YAML from 'json-to-pretty-yaml';
import { Command, CommandType } from '../lib/command.js';
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
import {
  PROJECT_PACKAGE_JSON_ENGINES,
  PROJECT_PACKAGE_JSON_EXPORTS,
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_TYPE,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../constants/project.js';
import {
  TYPESCRIPT_CONFIG_CONTENT,
  TYPESCRIPT_UI_CONFIG_CONTENT,
} from '../constants/static-typing.js';
import { PRETTIER_CONFIG_CONTENT } from '../constants/formatters.js';
import {
  ESLINT_CONFIG_CONTENT,
  ESLINT_UI_CONFIG_CONTENT,
  STYLELINT_CONFIG_CONTENT,
  STYLELINT_UI_CONFIG_CONTENT,
} from '../constants/linters.js';

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

export default new Command<Project, LibifyFlags>({
  name: 'libify',
  description:
    "The libify command cleans a project's cache and configures it with package.json scripts and Github Action workflows.",
  run: async ({ config, flags }) => {
    try {
      const build = Boolean(config.build) || flags['build'];
      const test = Boolean(config.test) || flags['test'];

      const existingPackageJsonContents = await JSON.parse(
        (await readFile('./package.json')).toString(),
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

      const devDependencies = await getDevDependencies({
        ava: config.test?.tool === TestTool.Ava,
        eslint: config.environments?.development?.linters?.includes(
          CodeLinterTool.ESLint,
        ),
        github: config.type === ProjectType.GitHubAction,
        jest: config.test?.tool === TestTool.Jest,
        jestReact: config.test?.tool === TestTool.Jest && flags.react,
        prettier: config.environments?.development?.formatters?.includes(
          CodeFormatterTool.Prettier,
        ),
        react:
          config?.type === ProjectType.WebApplication ||
          config?.type === ProjectType.ComponentLibrary ||
          flags.react,
        reactRouter: flags.reactRouter,
        styledComponents: flags.styledComponents,
        stylelint: config.environments?.development?.linters?.includes(
          CodeLinterTool.Stylelint,
        ),
        testCoverage: Boolean(config.test?.coverage),
        typescript:
          // config?.environments?.development?.staticTyping.includes(
          //   StaticTypingTool.TypeScript,
          // ) ??
          true,
      });

      console.log('devDependencies', devDependencies);

      const newPackageMetadata = constructPackageJson({
        author: 'Steven Bennett <steven@srclaunch.com>',
        dependencies: await getDependencies(config.requirements?.packages),
        description: config.description,
        devDependencies: {
          ...devDependencies,
          ...((await getDependencies(config.requirements?.devPackages)) ?? {}),
        },
        engines: {
          node: config.requirements?.node ?? PROJECT_PACKAGE_JSON_ENGINES.node,
          npm: config.requirements?.node ?? PROJECT_PACKAGE_JSON_ENGINES.npm,
          yarn: config.requirements?.node ?? PROJECT_PACKAGE_JSON_ENGINES.yarn,
        },
        exports,
        files: config.release?.package?.files ?? PROJECT_PACKAGE_JSON_FILES,
        license: config.release?.package?.publish?.license ?? License.MIT,
        main: config.release?.package?.main ?? PROJECT_PACKAGE_JSON_MAIN,
        module: config.release?.package?.module ?? PROJECT_PACKAGE_JSON_MODULE,
        name: config.name,
        peerDependencies: await getDependencies(
          config.requirements?.peerPackages,
        ),
        publishConfig: {
          access: config?.release?.package?.publish?.access ?? 'private',
          registry:
            config.release?.package?.publish?.registry ??
            'https://registry.npmjs.org/',
        },
        scripts: {
          ...getPackageScripts({
            build: Boolean(config.build) || flags['build'],
            release: Boolean(config.release) || flags['release'],
            run: config.run,
            test: Boolean(config.test),
          }),
          ...config.release?.package?.scripts,
        },
        types: config.release?.package?.types ?? PROJECT_PACKAGE_JSON_TYPES,
        type: config.release?.package?.type ?? PROJECT_PACKAGE_JSON_TYPE,
        version: existingPackageJsonContents.version ?? '0.0.0',
      });

      const diff = diffJson(existingPackageJsonContents, newPackageMetadata);

      for (const change of diff) {
        if (change.added) {
          console.log('+ ' + chalk.green(change.value.toString().trim()));
        }

        if (change.removed) {
          console.log('- ' + chalk.red(change.value.toString().trim()));
        }
      }

      // const projectType = config.type;

      // // Clear Yarn cache
      await deleteDirectory(path.resolve('./node_modules'));
      await deleteDirectory(path.resolve('./coverage'));
      await deleteDirectory(path.resolve('./dist'));
      await deleteDirectory(path.resolve('./.yarn'));
      await deleteFile(path.resolve('./yarn.lock'));
      await writeFile(path.resolve('./yarn.lock'), '');
      await writeFile(path.resolve('./.yarnrc.yml'), YARNRC_CONTENT);

      await add('.');
      await commit('Clean project');
      await push({});

      await writeFile('./.gitignore', GITIGNORE_CONTENT);

      await add('./.gitignore');
      await commit('Update .gitignore');

      console.info(`${chalk.green('✔')} project cleaned`);

      await writeFile(
        './.github/workflows/publish.yml',
        getPublishYml({ build, test }),
      );
      console.info(`${chalk.green('✔')} updated publish workflow`);

      await writeFile(
        path.resolve('./package.yml'),
        YAML.stringify(newPackageMetadata),
      );
      console.info(`${chalk.green('✔')} resolved dependencies`);

      if (config.environments?.development) {
        // @ts-expect-error
        if (config.environments?.development?.staticTyping) {
          // @ts-expect-error
          for (const tool of config.environments?.development.staticTyping) {
            switch (tool) {
              case StaticTypingTool.TypeScript:
                const uiConfig =
                  config.type === ProjectType.WebApplication ||
                  config?.type === ProjectType.ComponentLibrary ||
                  flags['react'];
                await writeFile(
                  path.resolve('./tsconfig.json'),
                  JSON.stringify(
                    uiConfig
                      ? TYPESCRIPT_UI_CONFIG_CONTENT
                      : TYPESCRIPT_CONFIG_CONTENT,
                    null,
                    2,
                  ),
                );
                console.info(`${chalk.green('✔')} added TypeScript config`);
                break;
              default:
                break;
            }
          }

          if (config.environments?.development?.formatters) {
            for (const formatter of config.environments?.development
              ?.formatters) {
              switch (formatter) {
                case CodeFormatterTool.Prettier:
                  await writeFile(
                    path.resolve('./.prettierrc.cjs'),
                    JSON.stringify(PRETTIER_CONFIG_CONTENT, null, 2),
                  );
                  console.info(`${chalk.green('✔')} added Prettier config`);
                  break;
                default:
                  break;
              }
            }
          }

          if (config.environments?.development?.linters) {
            const ui =
              config.type === ProjectType.WebApplication ||
              config?.type === ProjectType.ComponentLibrary ||
              flags['react'];

            for (const linter of config.environments?.development?.linters) {
              switch (linter) {
                case CodeLinterTool.ESLint:
                  await writeFile(
                    path.resolve('./.eslintrc.cjs'),
                    JSON.stringify(
                      ui ? ESLINT_UI_CONFIG_CONTENT : ESLINT_CONFIG_CONTENT,
                      null,
                      2,
                    ),
                  );
                  console.info(`${chalk.green('✔')} added ESLint config`);
                  break;
                case CodeLinterTool.Stylelint:
                  await writeFile(
                    path.resolve('./.stylelintrc.js'),
                    JSON.stringify(
                      ui
                        ? STYLELINT_UI_CONFIG_CONTENT
                        : STYLELINT_CONFIG_CONTENT,
                      null,
                      2,
                    ),
                  );
                  console.info(`${chalk.green('✔')} added Stylelint config`);
                  break;
                default:
                  break;
              }
            }
          }
        }
        // }

        // const yarn = new YarnProject(
        //   // @ts-expect-error - Not sure how to use this API to be frank
        //   './',
        //   { configuration: {} },
        // );
        // const plugin = Yarn .commands?.['SetVersionCommand']

        // const workspace = new Workspace('./', { project: {

        // }});

        // const report = Report;

        // await yarn.install({
        //   cache: new Cache('.', {
        //     configuration: {},
        //   }),
        //   report: {

        //   }
        // });
        await shellExec('yarn init');
        await shellExec('yarn set version stable');
        await shellExec('yarn plugin import interactive-tools');
        await shellExec(
          'yarn plugin import https://raw.githubusercontent.com/lyleunderwood/yarn-plugin-yaml-manifest/master/bundles/%40yarnpkg/plugin-yaml-manifest.js',
        );

        if (config.release?.package?.publish) {
          await shellExec(
            'yarn plugin import https://raw.githubusercontent.com/mhassan1/yarn-plugin-licenses/v0.8.1/bundles/@yarnpkg/plugin-licenses.js',
          );
        }

        await shellExec('yarn install');

        console.info(`${chalk.green('✔')} installed dependencies`);

        if (build) {
          await shellExec('yarn build');
        }

        if (test) {
          await shellExec('yarn test');
        }

        await add('./');
        await commit('Libified project');
        await push({ followTags: false });
      }
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
