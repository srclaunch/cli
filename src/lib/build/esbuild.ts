import { build as buildCommand, Format } from 'esbuild';
import { build as buildTypes } from './types';
import {
  BuildFormat,
  BuildOptions,
  BuildPlatform,
  BuildTarget,
  BundleOptions,
  // ESBuildOptions,
} from '@srclaunch/types';
import path from 'path';
import { getFormatFileExtension } from './formats';

export interface ESBuildOptions extends Omit<BuildOptions, 'formats' | 'tool'> {
  readonly format: BuildFormat.CJS | BuildFormat.ESM | BuildFormat.UMD;
}
export async function build({
  bundle = true,
  format = BuildFormat.ESM,
  input,
  minify = true,
  output,
  platform = BuildPlatform.Browser,
  sourcemap = true,
  splitting = true,
  target = BuildTarget.ESNext,
  treeShaking = true,
  types = true,
}: ESBuildOptions) {
  try {
    console.info(
      `Compiling and bundling JS to ${format.toLocaleUpperCase()} format...`,
    );

    const entryPoints = [
      ...[
        path.join(
          path.resolve(),
          input?.directory ?? 'src',
          input?.file ?? 'index.ts',
        ),
      ],
      ...(input?.files
        ? input.files.map(f =>
            path.join(path.resolve(), input?.directory ?? 'src', f),
          )
        : []),
    ];

    const result = await buildCommand({
      bundle: Boolean(bundle),
      entryPoints: entryPoints,
      external: typeof bundle === 'object' ? (bundle.exclude as string[]) : [],
      format: format as Format,
      minify,
      outdir: output?.directory ?? 'dist',
      outfile: splitting
        ? undefined
        : `${output?.file ?? 'index'}${getFormatFileExtension(format)}`,
      platform,
      sourcemap,
      splitting: format === 'esm' && splitting,
      target,
      treeShaking,
    });

    if (result.warnings) {
      result.warnings.forEach(warning => {
        console.warn(warning.text);
      });
    }

    if (result.errors) {
      result.errors.forEach(error => {
        console.error(error.text);
      });
    }

    if (types) {
      console.info('Compiling TS definitions...');
      await buildTypes({ input, types, output });
    }

    console.info(`Finished building to ${format} format.`);
  } catch (err: any) {
    console.error(`Error occurred while building: ${err.name}`, err);
  }
}
