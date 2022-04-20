import { Command, CommandType } from '../lib/command.js';
import { build as esbuild } from '../lib/build/esbuild.js';
import { build as vite } from '../lib/build/vite.js';
import {
  BuildOptions,
  ESBuildOptions,
  Project,
  ProjectType,
  ViteBuildOptions,
} from '@srclaunch/types';
import { TypedFlags } from 'meow';

export default new Command({
  name: 'build',
  description: 'Commands for building various types of projects',
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
          };
        }>;
      }) => {
        const buildOptions = config.build as BuildOptions | BuildOptions[];

        if (!buildOptions) {
          throw new Error('Missing build configuration');
        }

        if (typeof buildOptions === 'object' && !Array.isArray(buildOptions)) {
          if (buildOptions.formats && buildOptions.formats?.length > 0) {
            for (const format of buildOptions.formats) {
              await esbuild({
                ...buildOptions,
                clean: flags.clean,
                format,
              } as ESBuildOptions);
            }
          } else {
            await esbuild(buildOptions as ESBuildOptions);
          }
        } else if (Array.isArray(buildOptions)) {
          if (buildOptions) {
            for (const build of buildOptions) {
              if (build.formats && build.formats?.length > 0) {
                for (const format of build.formats) {
                  await esbuild({
                    ...buildOptions,
                    clean: flags.clean,
                    format,
                  } as ESBuildOptions);
                }
              } else {
                await esbuild(build as ESBuildOptions);
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
            library: config.type === ProjectType.Library,
          } as ViteBuildOptions);
        } else if (Array.isArray(buildOptions)) {
          if (buildOptions) {
            for (const build of buildOptions) {
              await vite({
                ...build,
                library: config.type === ProjectType.Library,
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
