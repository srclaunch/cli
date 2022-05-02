import {
  License,
  Project,
  ProjectType,
  TestTool,
  CodeFormatterTool,
  CodeLinterTool,
  StaticTypingTool,
} from '@srclaunch/types';
import {
  Cache,
  Configuration,
  Project as YarnProject,
  Report,
} from '@yarnpkg/core';
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
import { writeToolingConfiguration } from '../lib/libify/tooling.js';
import release from './release.js';
import { createRelease } from '../lib/release.js';

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

      const coreDevDependencies = await getDevDependencies({
        ava: config.test?.tool === TestTool.Ava,
        eslint: config.environments?.development?.linters?.includes(
          CodeLinterTool.ESLint,
        ),
        github: config.type === ProjectType.GitHubAction,
        jest: config.test?.tool === TestTool.Jest,
        jestReact: config.test?.tool === TestTool.Jest || (flags.react && test),
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

      const sortDependencies = (
        dependencies: { [key: string]: string } | undefined,
      ) => {
        if (!dependencies) {
          return;
        }

        return Object.entries(dependencies)
          .sort(([, v1], [, v2]) => +v2 - +v1)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      };

      const customDevDependencies = await getDependencies(
        config.requirements?.devPackages,
      );

      const devDependencies = {
        ...coreDevDependencies,
        ...customDevDependencies,
      };

      const dependencies = await getDependencies(config.requirements?.packages);
      const peerDependencies = await getDependencies(
        config.requirements?.peerPackages,
      );

      const newPackageMetadata = constructPackageJson({
        author: 'Steven Bennett <steven@srclaunch.com>',
        dependencies: sortDependencies(dependencies),
        description: config.description,
        devDependencies: sortDependencies(devDependencies),
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
        peerDependencies: sortDependencies(peerDependencies),
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
          console.log(chalk.green.bold(`+ Added: ${change.count}`));
          console.log(chalk.green(`+ ${change.value.toString().trim()}`));
        }

        if (change.removed) {
          console.log(chalk.red.bold(`- Removed: ${change.count}`));
          console.log(chalk.red(`- ${change.value.toString().trim()}`));
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
      await push({ followTags: false });

      await writeFile('./.gitignore', GITIGNORE_CONTENT);

      await add('./.gitignore');
      await commit('Update .gitignore');

      console.info(`${chalk.green('✔')} project cleaned`);

      /* 
        Create a GitHub Action workflow file based on the project
        configuration.
      */
      await writeFile(
        './.github/workflows/publish.yml',
        getPublishYml({ build, test }),
      );
      console.info(`${chalk.green('✔')} added GitHub Actions publish workflow`);

      /* 
        Write package.yml which will be used by the `yarn-plugin-yaml-manifest`
        plugin to generate a package.json manifest.
      */
      await writeFile(
        path.resolve('./package.yml'),
        YAML.stringify(newPackageMetadata),
      );
      console.info(`${chalk.green('✔')} created package.yml`);

      await writeToolingConfiguration({
        formatters: config.environments?.development?.formatters,
        linters: config.environments?.development?.linters,
        project: config,
        staticTyping: [StaticTypingTool.TypeScript],
        // config.environments?.development?.staticTyping,
      });

      console.info(`${chalk.green('✔')} created DX tooling configurations`);

      await shellExec('corepack enable yarn');
      await shellExec('yarn set version stable');

      console.info(`${chalk.green('✔')} initialized Yarn`);

      await shellExec('yarn plugin import interactive-tools');
      await shellExec(
        'yarn plugin import https://raw.githubusercontent.com/lyleunderwood/yarn-plugin-yaml-manifest/master/bundles/%40yarnpkg/plugin-yaml-manifest.js',
      );
      console.info(`${chalk.green('✔')} added Yarn plugins`);

      const yarn = new YarnProject(
        // @ts-expect-error - Not sure how to use this API to be frank
        './',
        { configuration: {} },
      );

      await yarn.install({
        cache: new Cache(
          // @ts-expect-error - Not sure how to use this API
          { __pathType: 1 },
          {
            configuration: Configuration,
          },
        ),
        report: {
          reportCacheHit: locator => {
            console.info(`Cache hit for ${locator.toString()}`);
          },
          reportCacheMiss: (locator, message) => {
            console.info(`Cache miss for ${locator.toString()}`);
            console.log(message);
          },
          startSectionPromise: (opts, cb) => {
            console.info(`Starting section ${opts.reportHeader}`);
            return cb();
          },
          startSectionSync: (opts, cb) => {
            console.info(`Starting section ${opts.reportHeader}`);
            return cb();
          },
          startTimerPromise: (what, opts, cb) => {
            console.log(`Starting timer ${what}`);
            return cb();
          },
          startCacheReport: cb => {
            console.log('Starting cache report');
            return cb();
          },
          reportSeparator: () => {
            console.log(
              '-------------------------------------------------------',
            );
          },
          reportInfo: (name, text) => {
            console.log(`${name} ${text}`);
          },
          reportWarning: (name, text) => {
            console.log(`${name} ${text}`);
          },
          reportError: (name, text) => {
            console.log(`${name} ${text}`);
          },
          reportProgress: progress => {
            console.log(`Progress: ${progress}`);
          },
          reportJson: data => {
            console.log(JSON.stringify(data, null, 2));
          },
          finalize: () => {
            console.log('Finalizing report');
          },
        } as Report,
      });

      console.info(`${chalk.green('✔')} installed dependencies`);

      // if (
      //   config.environments.development.staticTyping.includes(
      //     StaticTypingTool.TypeScript,
      //   )
      // ) {
      //   await shellExec('yarn plugin import typescript');
      // }

      // await shellExec('yarn install');

      if (build) {
        await shellExec('yarn build');
      }

      if (test) {
        await shellExec('yarn test');
      }

      await add('.');
      await commit('Libified project');
      await createRelease();
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
