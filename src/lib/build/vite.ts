import { build as buildCommand } from 'vite';
import react from '@vitejs/plugin-react';
import { build as buildTypes } from './types';
import path from 'node:path';
import {
  BuildFormat,
  BuildOptions,
  BuildPlatform,
  BuildTarget,
  // ViteBuildOptions,
} from '@srclaunch/types';

export interface ViteBuildOptions
  extends Omit<
    BuildOptions,
    'bundle' | 'format' | 'splitting' | 'tool' | 'treeShaking'
  > {
  readonly bundle?: {
    readonly exclude?: readonly string[];
    readonly optimize?: readonly string[];
  };
  readonly format: BuildFormat.CJS | BuildFormat.ESM | BuildFormat.UMD;
}

export async function build({
  assets,
  bundle,
  format = BuildFormat.ESM,
  formats,
  input,
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

    const result = await buildCommand({
      build: {
        assetsDir: path.join(path.resolve(), assets?.directory ?? 'assets'),
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
              fileName: format => `index.${format}.js`,
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
      root: path.join(path.resolve(), rootDir),
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
