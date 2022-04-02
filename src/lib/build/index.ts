import { build as buildCommand } from 'esbuild';
import ts, { Program } from 'typescript';
import fs from 'fs-extra';
import path from 'path';
import { BuildConfig } from '../../types/build/index';

export async function build({
  buildDir = 'dist',
  buildFile = 'index.js',
  buildPath = '',
  buildTypes = false,
  bundle = true,
  bundleCSS = true,
  codeSplitting = true,
  color = true,
  define = {},
  excludeLibs = [],
  format = 'esm',
  inputScripts = ['src/index.ts'],
  minify = true,
  platform = 'browser',
  showWarnings = false,
  sourceMap = true,
  target = 'es6',
  treeShaking = true,
  tsconfigPath = '',
}: BuildConfig) {
  try {
    console.info(
      `Compiling and bundling JS to ${format.toLocaleUpperCase()} format...`,
    );

    const defineValue: BuildConfig['define'] = define
      ? Object.entries(define).reduce((acc, [key, value]) => {
        // @ts-ignore
          acc[key] = JSON.stringify(value);
          return acc;
        }, {})
      : {};

    const config = {
      bundle,
      color,
      define: defineValue,
      entryPoints: inputScripts.map(script =>
        path.join(
          path.resolve(),
          // buildPath,
          script,
        ),
      ),
      external: excludeLibs,
      format,
      minify,
      outdir:
        format === 'esm' && codeSplitting
          ? path.join(
              path.resolve(),
              //  buildPath,
              buildDir,
            )
          : undefined,
      outfile:
        format === 'esm' && codeSplitting
          ? undefined
          : inputScripts.length === 1
          ? path.join(
              path.resolve(),
              //  buildPath,
              buildDir,
              buildFile,
            )
          : undefined,
      platform,
      sourcemap: sourceMap,
      splitting: format === 'esm' && codeSplitting,
      target,
      treeShaking,
    };

    const result = await buildCommand(config);

    if (result.warnings && showWarnings) {
      result.warnings.forEach(warning => {
        console.warn(warning.text);
      });
    }

    if (result.errors) {
      result.errors.forEach(error => {
        console.error(error.text);
      });
    }

    if (buildTypes) {
      const tsConfigContents = await fs.readFile(
        path.join(path.resolve(), tsconfigPath),
        'utf8',
      );
      const tsConfig = await JSON.parse(tsConfigContents.toString());
      const tsConfigUpdatedWithPath = {
        ...tsConfig,
        compilerOptions: {
          ...tsConfig.compilerOptions,
          declarationDir: path.join(path.resolve(), buildPath, 'dist'),
          rootDir: path.join(path.resolve(), buildPath, 'src'),
        },
      };
      const { options } = ts.parseJsonConfigFileContent(
        tsConfigUpdatedWithPath,
        ts.sys,
        path.join(path.resolve(), buildPath),
      );
      const srcFiles = await fs.readdir(
        path.join(path.resolve(), buildPath, 'src'),
      );
      const buildFiles = srcFiles
        .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
        .map(file => {
          return path.join(path.resolve(), buildPath, 'src', file);
        });
      const program: Program = ts.createProgram(buildFiles, options);
      const emitResult = program.emit();
      const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

      for (const diagnostic of allDiagnostics) {
        if (diagnostic.file) {
          const { line, character } =
            diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n',
          );
          console.log(
            `${diagnostic.file.fileName} (${line + 1},${
              character + 1
            }): ${message}`,
          );
        } else {
          console.log(
            `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
          );
        }
      }
    }
  } catch (err: any) {
    console.error(err);
  }
}
