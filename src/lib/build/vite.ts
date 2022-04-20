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
import { emptyDirectory } from '../file-system.js';
import { getViteFormatFileExtension } from './formats.js';

export async function build({
  assets,
  bundle,
  format = BuildFormat.ESM,
  formats,
  input = {
    directory: 'src',
    file: 'index.ts',
  },
  library = false,
  manifest = true,
  minify = true,
  output,
  platform = BuildPlatform.Browser,
  rootDir = path.resolve(),
  sourcemap = true,
  target = BuildTarget.ESNext,
  types = true,
  webApp,
}: ViteBuildOptions) {
  try {
    console.info(
      `Compiling and bundling JS to ${
        formats && formats.length > 0
          ? `${formats.join(', ').toLocaleUpperCase()} formats.`
          : `${format.toLocaleUpperCase()} format.`
      }`,
    );

    const viteFormats = (
      formats && formats.length > 0
        ? formats?.map(f => (f === BuildFormat.ESM ? 'es' : f))
        : [format === BuildFormat.ESM ? 'es' : format]
    ) as ('cjs' | 'es' | 'iife' | 'umd')[];

    if (output?.clean) {
      await emptyDirectory(output.directory);
    }

    const result = await buildCommand({
      build: {
        assetsDir: assets?.directory
          ? path.join(path.resolve(), assets?.directory)
          : undefined,
        emptyOutDir: output?.clean ?? true,
        outDir: output?.directory ?? 'dist',
        lib: Boolean(library)
          ? {
              entry: path.join(
                path.resolve(),
                input?.directory ?? 'src',
                input?.file ?? 'index.ts',
              ),
              formats: viteFormats,
              name: typeof library === 'object' ? library.name : undefined,
              fileName: format => `index${getViteFormatFileExtension(format)}`,
            }
          : false,
        manifest,
        minify,

        sourcemap,
        ssrManifest: manifest && webApp?.ssr,
        target,
      },
      envPrefix: 'SRCLAUNCH_',
      optimizeDeps: {
        exclude:
          typeof bundle === 'object' ? (bundle?.exclude as string[]) ?? [] : [],
        include:
          typeof bundle === 'object'
            ? (bundle?.optimize as string[]) ?? []
            : [],
      },
      plugins: webApp?.react ? [react()] : [],
      root: rootDir,
    });

    console.log(result);

    if (types) {
      console.info('Compiling TS definitions...');
      await buildTypes({ input, types, output });
    }

    // if (result.errors) {
    //   result.errors.forEach(error => {
    //     console.error(error.text);
    //   });
    // }

    console.info(
      `Finished building to ${
        formats && formats.length > 0
          ? `${formats.join(', ').toLocaleUpperCase()} formats.`
          : `${format.toLocaleUpperCase()} format.`
      }`,
    );
  } catch (err: any) {
    console.error(`Error occurred while building: ${err.name}`, err);
  }
}
