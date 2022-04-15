import { Command, CommandType } from '../lib/command';
import { build as esbuild } from '../lib/build/esbuild';
import { build as vite } from '../lib/build/vite';
import {
  BuildOptions,
  ESBuildOptions,
  Project,
  ViteBuildOptions,
} from '@srclaunch/types';

export default new Command({
  name: 'build',
  description: 'Commands for building various types of projects',
  commands: [
    new Command<Project>({
      name: 'esbuild',
      description: 'Compiles and optionally bundles a package using esbuild',
      run: async ({ config, flags }) => {
        const buildOptions = config.build as BuildOptions | BuildOptions[];

        if (!buildOptions) {
          throw new Error(
            'You must provide build configuration in your `srclaunch.config.ts` file.',
          );
        }

        if (typeof buildOptions === 'object' && !Array.isArray(buildOptions)) {
          if (buildOptions.formats && buildOptions.formats?.length > 0) {
            for (const format of buildOptions.formats) {
              await esbuild({
                ...buildOptions,
                format,
              } as ESBuildOptions);
            }
          } else {
            await esbuild(buildOptions as ESBuildOptions);
          }
        } else if (Array.isArray(buildOptions)) {
          if (buildOptions) {
            for (const build of buildOptions) {
              await esbuild(build as ESBuildOptions);
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
          throw new Error(
            'You must provide build configuration in your `srclaunch.config.ts` file.',
          );
        }

        if (typeof buildOptions === 'object' && !Array.isArray(buildOptions)) {
          await vite(buildOptions as ViteBuildOptions);
        } else if (Array.isArray(buildOptions)) {
          if (buildOptions) {
            for (const build of buildOptions) {
              await vite(build);
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
