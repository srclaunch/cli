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

export default new Command({
  name: 'build',
  description: 'Commands for building various types of projects',
  run: async ({
    config,
    flags,
  }: {
    config: Project;
    flags: TypedFlags<{
      clean?: {
        type: 'boolean';
        default: true;
      };
    }>;
  }) => {
    const buildOptions = config.build as BuildOptions | BuildOptions[];

    if (!buildOptions) {
      throw new Error('Missing build configuration');
    }

    let run = 0;
    if (typeof buildOptions === 'object' && !Array.isArray(buildOptions)) {
      switch (buildOptions.tool) {
        case BuildTool.Vite:
          await vite({
            ...buildOptions,
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
          const formats = buildOptions.formats ?? [
            buildOptions.format ?? BuildFormat.ESM,
          ];

          for (const format of formats) {
            const clean = buildOptions.output?.clean ?? run === 0;
            const types = buildOptions.types ?? run === 0;

            await esbuild({
              ...buildOptions,
              output: {
                directory: 'dist',
                file: 'index',
                ...buildOptions.output,
                clean,
              },
              format: format,
              types,
            } as ESBuildOptions);

            run = run + 1;
          }
      }
    } else if (Array.isArray(buildOptions)) {
      for (const build of buildOptions) {
        switch (build.tool) {
          case BuildTool.Vite:
            await vite({
              ...build,
              library:
                config.type === ProjectType.Library ||
                config.type == ProjectType.CLIApplication,
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
                  directory: 'dist',
                  file: 'index',
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
    new Command<Project>({
      name: 'esbuild',
      description: 'Compiles and optionally bundles a package using esbuild',
      run: async ({
        config,
        flags,
      }: {
        config: Project;
        flags: TypedFlags<{
          clean?: {
            type: 'boolean';
            default: true;
          };
        }>;
      }) => {
        const buildOptions = config.build as BuildOptions | BuildOptions[];

        if (!buildOptions) {
          throw new Error('Missing build configuration');
        }

        let run = 0;
        if (typeof buildOptions === 'object' && !Array.isArray(buildOptions)) {
          if (buildOptions.formats && buildOptions.formats?.length > 0) {
            for (const format of buildOptions.formats) {
              const clean = buildOptions.output?.clean ?? run === 0;
              const types = buildOptions.types ?? run === 0;

              await esbuild({
                ...buildOptions,
                output: {
                  directory: 'dist',
                  file: 'index',
                  ...buildOptions.output,
                  clean,
                },
                format,
                types,
              } as ESBuildOptions);

              run = run = 1;
            }
          } else {
            await esbuild(buildOptions as ESBuildOptions);
          }
        } else if (Array.isArray(buildOptions)) {
          if (buildOptions) {
            for (const build of buildOptions) {
              if (build.formats && build.formats?.length > 0) {
                for (const format of build.formats) {
                  const clean = build.output?.clean ?? run === 0;
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
    new Command<Project>({
      name: 'vite',
      description: 'Compiles and bundles a package using Vite',
      run: async ({ config, flags }) => {
        const buildOptions = config.build;

        if (!buildOptions) {
          throw new Error('Missing build configuration');
        }

        if (typeof buildOptions === 'object' && !Array.isArray(buildOptions)) {
          await vite({
            ...buildOptions,
            library:
              config.type === ProjectType.Library ||
              config.type === ProjectType.CLIApplication
                ? {
                    name: config.name,
                  }
                : false,
          } as ViteBuildOptions);
        } else if (Array.isArray(buildOptions)) {
          if (buildOptions) {
            for (const build of buildOptions) {
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
