import { Command, CommandType } from '../lib/command.js';
import { build as esbuild } from '../lib/build/esbuild.js';
import { build as vite } from '../lib/build/vite.js';
import {
  BuildFormat,
  BuildOptions,
  BuildTool,
  ESBuildOptions,
  Project,
  ProjectType,
  ViteBuildOptions,
} from '@srclaunch/types';
import { TypedFlags } from 'meow';

type BuildFlags = TypedFlags<{
  clean: {
    alias: 'c';
    default: true;
    description: 'Clean build directory before building';
    type: 'boolean';
  };
}>;

export default new Command<Project, BuildFlags>({
  name: 'build',
  description: 'Commands for building various types of projects',
  run: async ({ config, flags }: { config: Project; flags: BuildFlags }) => {
    const options = config.build as BuildOptions | BuildOptions[];

    if (!options) {
      throw new Error('Missing build configuration');
    }

    let run = 0;
    if (typeof options === 'object' && !Array.isArray(options)) {
      switch (options.tool) {
        case BuildTool.Vite:
          await vite({
            ...options,
            library:
              config.type === ProjectType.Library ||
              config.type === ProjectType.CLIApplication
                ? {
                    name: config.name,
                  }
                : false,
          } as ViteBuildOptions);
          return;
        case BuildTool.ESBuild:
        default:
          const formats = options.formats ?? [BuildFormat.ESM];

          for (const format of formats) {
            const clean = options.output?.clean ?? run === 0;
            const types = options.types ?? run === 0;

            await esbuild({
              ...options,
              output: {
                ...options.output,
                clean,
              },
              format: format,
              types,
            } as ESBuildOptions);

            run = run + 1;
          }
      }
    } else if (Array.isArray(options)) {
      for (const build of options) {
        switch (build.tool) {
          case BuildTool.Vite:
            await vite({
              ...build,
              library:
                config.type === ProjectType.Library ||
                config.type === ProjectType.CLIApplication
                  ? {
                      name: config.name,
                    }
                  : false,
            } as ViteBuildOptions);
            break;
          case BuildTool.ESBuild:
          default:
            const formats = build?.formats ?? [build.format ?? BuildFormat.ESM];

            for (const format of formats) {
              const clean = build.output?.clean ?? run === 0;
              const types = build.types ?? run === 0;

              await esbuild({
                ...build,
                output: {
                  ...build.output,
                  clean,
                },
                format,
                types,
              } as ESBuildOptions);
              run = run + 1;
            }
        }
      }
    }
  },
  commands: [
    new Command<Project, BuildFlags>({
      name: 'esbuild',
      description: 'Compiles and optionally bundles a package using esbuild',
      run: async ({
        config,
        flags,
      }: {
        config: Project;
        flags: BuildFlags;
      }) => {
        const options = config.build as BuildOptions | BuildOptions[];

        if (!options) {
          throw new Error('Missing build configuration');
        }

        let run = 0;
        if (typeof options === 'object' && !Array.isArray(options)) {
          if (options.formats && options.formats?.length > 0) {
            for (const format of options.formats) {
              const clean = options.output?.clean ?? run === 0;
              const types = options.types ?? run === 0;

              await esbuild({
                ...options,
                output: {
                  ...options.output,
                  clean,
                },
                format,
                types,
              } as ESBuildOptions);

              run = run = 1;
            }
          } else {
            await esbuild(options as ESBuildOptions);
          }
        } else if (Array.isArray(options)) {
          if (options) {
            for (const build of options) {
              if (build.formats && build.formats?.length > 0) {
                for (const format of build.formats) {
                  const clean =
                    (build.output?.clean || Boolean(flags.clean)) ?? run === 0;
                  const types = build.types ?? run === 0;

                  await esbuild({
                    ...build,
                    output: {
                      directory: 'dist',
                      file: 'index',
                      ...build.output,
                      clean,
                    },
                    format,
                    types,
                  } as ESBuildOptions);

                  run = run = 1;
                }
              } else {
                const clean =
                  (build.output?.clean || Boolean(flags.clean)) && run === 0;
                const types = build.types ?? run === 0;

                await esbuild({
                  ...build,
                  output: {
                    directory: 'dist',
                    file: 'index',
                    ...build.output,
                    clean,
                  },
                  types,
                } as ESBuildOptions);
              }
            }
          }
        }
      },
    }),
    new Command<Project, BuildFlags>({
      name: 'vite',
      description: 'Compiles and bundles a package using Vite',
      run: async ({ config, flags }) => {
        const options = config.build;

        if (!options) {
          throw new Error('Missing build configuration');
        }

        if (typeof options === 'object' && !Array.isArray(options)) {
          await vite({
            ...options,
            library:
              config.type === ProjectType.Library ||
              config.type === ProjectType.CLIApplication
                ? {
                    name: config.name,
                  }
                : false,
          } as ViteBuildOptions);
        } else if (Array.isArray(options)) {
          if (options) {
            for (const build of options) {
              await vite({
                ...build,
                library:
                  config.type === ProjectType.Library ||
                  config.type === ProjectType.CLIApplication
                    ? {
                        name: config.name,
                      }
                    : false,
              } as ViteBuildOptions);
            }
          }
        }
      },
      type: CommandType.Project,
    }),
    new Command({
      name: 'types',
      description: 'Builds Typescript definitions',
      run: async ({ config, flags }) => {},
    }),
    new Command({
      name: 'help',
      description: 'Shows help for build commands',
      run: async () => {
        console.info(
          'Available build commands are: lib, web-app, web-service, types, and help',
        );
      },
      type: CommandType.Project,
    }),
  ],
});
