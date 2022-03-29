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

    const config = {
      bundle,
      color,
      define,
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
           buildFile
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
      console.info('Compiling types... ');

      const tsConfigContents = await fs.readFile(
        path.join(path.resolve(), tsconfigPath),
        'utf8',
      );
      const tsConfig = await JSON.parse(tsConfigContents.toString());
      const tsConfigUpdatedWithPath = {
        ...tsConfig,
        compilerOptions: {
          ...tsConfig.compilerOptions,
          rootDir: path.join(path.resolve(), buildPath, 'src'),
        },
        include: tsConfig.include.map((include: string) =>
          path.join(path.resolve(), include),
        ),
      };

      const { options } = ts.parseJsonConfigFileContent(
        tsConfigUpdatedWithPath,
        ts.sys,
        path.join(path.resolve(), buildPath),
      );

      const buildFiles = (
        await fs.readdir(path.join(path.resolve(), buildPath, 'src'))
      )
        .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
        .map(file => {
          return path.join(path.resolve(), buildPath, 'src', file);
        });

      const program: Program = ts.createProgram(buildFiles, options);
      const emitResult = program.emit();

      let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

      allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
          let { line, character } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start!,
          );
          let message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n',
          );
          console.info(
            `${diagnostic.file.fileName} (${line + 1},${
              character + 1
            }): ${message}`,
          );
        } else {
          console.info(
            ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
          );
        }
      });
    }
  } catch (err: any) {
    console.error(err);
  }
}
