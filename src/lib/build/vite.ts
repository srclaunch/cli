import { build as buildCommand } from 'vite';
import react from '@vitejs/plugin-react';
import { build as buildTypes } from './types.js';
import path from 'node:path';
import {
  BuildFormat,
  BuildPlatform,
  BuildTarget,
  ViteBuildOptions,
} from '@srclaunch/types';
import { getViteFormatFileExtension } from './formats.js';
import chalk from 'chalk';
import { BUILD_DIR } from '../../constants/build.js';

export async function build({
  assets,
  bundle,
  format = BuildFormat.ESM,
  formats = [BuildFormat.ESM, BuildFormat.UMD],
  input,
  library = false,
  optimize,
  manifest = true,
  minify = true,
  output,
  platform = BuildPlatform.Browser,
  rootDir,
  sourcemap = true,
  target = BuildTarget.ESNext,
  types = true,
  webApp,
}: ViteBuildOptions) {
  try {
    const viteFormats = (
      formats && formats.length > 0
        ? formats?.map(f => (f === BuildFormat.ESM ? 'es' : f))
        : [format === BuildFormat.ESM ? 'es' : format]
    ) as ('cjs' | 'es' | 'iife' | 'umd')[];

    await buildCommand({
      define: typeof bundle === 'object' ? bundle?.define : undefined,
      build: {
        assetsDir: assets?.directory
          ? path.join(path.resolve(), assets?.directory)
          : undefined,
        emptyOutDir: output?.clean ?? true,
        outDir: output?.directory ?? BUILD_DIR,
        lib: Boolean(library)
          ? {
              entry: path.join(
                path.resolve(),
                input?.directory ?? 'src',
                input?.file ?? 'index.ts',
              ),
              formats: viteFormats,
              name:
                library && typeof library === 'object'
                  ? library?.name
                  : undefined,
              fileName: format =>
                `${output?.file ?? 'index'}${getViteFormatFileExtension(
                  format,
                )}`,
            }
          : false,
        manifest,
        minify,
        rollupOptions: {
          external: (typeof bundle === 'object'
            ? bundle.exclude ?? []
            : []) as string[],
          output: {
            globals:
              typeof bundle === 'object' ? bundle.globals ?? {} : undefined,
          },
        },
        sourcemap,
        ssrManifest: manifest && webApp?.ssr,
        target,
      },
      configFile: false,
      envPrefix: 'SRCLAUNCH_',
      optimizeDeps: {
        exclude: (optimize?.exclude ?? []) as string[],
        include: (optimize?.include ?? []) as string[],
      },
      plugins: webApp?.react ? [react()] : [],
      root: rootDir ?? path.join(path.resolve(), input?.directory ?? 'src'),
    });

    // console.log('result', result);

    // if (Array.isArray(result) && result.length > 0 && result[0]) {
    //   for (const output of result) {
    //     if (Array.isArray(output) && output.length > 0) {
    //       for (const line of output) {
    //         if (line.output) {
    //           for (const line of output.output) {
    //             if (line.type === 'asset') {
    //               `Wrote asset ${line.fileName}...`;
    //             } else {
    //               console.log(
    //                 `Wrote chunk ${line.fileName}... ${
    //                   line.code.length / 1024
    //                 } kb`,
    //               );
    //             }
    //           }
    //         }
    //       }
    //     }
    //     //  else if (typeof output === 'object') {
    //     //   if (output.output) {
    //     //     for (const line of output.output) {
    //     //       console.log(line);
    //     //     }
    //     //   }
    //     // }
    //   }
    // }

    if (types) {
      await buildTypes({ input, types, output });
      console.info(`${chalk.green('✔')} compiled types`);
    }

    // if (result.errors) {
    //   result.errors.forEach(error => {
    //     console.error(error.text);
    //   });
    // }

    console.info(
      `${chalk.green('✔')} bundled to ${
        formats && formats.length > 0
          ? `${chalk.bold(formats.join(', ').toLocaleUpperCase())} formats`
          : `${chalk.bold(format.toLocaleUpperCase())} format`
      }`,
    );
  } catch (err: any) {
    console.error(`Error occurred while building: ${err.name}`, err);
  }
}
