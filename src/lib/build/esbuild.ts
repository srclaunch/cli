import { build as buildCommand, Format } from 'esbuild';
import { build as buildTypes } from './types.js';
import {
  BuildFormat,
  BuildOptions,
  BuildPlatform,
  BuildTarget,
  BundleOptions,
  ESBuildOptions,
} from '@srclaunch/types';
import path from 'path';
import { getFormatFileExtension } from './formats.js';
import { emptyDirectory } from '../file-system.js';
import chalk from 'chalk';

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

    if (output?.clean) {
      await emptyDirectory(output?.directory ?? 'dist');
    }

    const result = await buildCommand({
      bundle: Boolean(bundle),
      entryPoints: entryPoints,
      external: typeof bundle === 'object' ? (bundle.exclude as string[]) : [],
      format: format as Format,
      minify,
      outdir: splitting ? output?.directory ?? 'dist' : undefined,
      outfile: splitting
        ? undefined
        : `${output?.directory ?? 'dist'}/${
            output?.file ?? 'index'
          }${getFormatFileExtension(format)}`,
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
      console.info(`${chalk.green('✔')} compiled types`);
      await buildTypes({ input, types, output });
    }

    console.info(
      `${chalk.green('✔')} bundled to ${chalk.bold(
        format.toLocaleUpperCase(),
      )} format`,
    );
  } catch (err: any) {
    console.error(err);
  }
}
