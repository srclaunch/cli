import ts, { Program } from 'typescript';
import fs from 'fs-extra';
import path from 'path';
import { BuildOptions } from '@srclaunch/types';
import { BUILD_DIR } from '../../constants/build.js';

export type TypesBuildOptions = Pick<
  BuildOptions,
  'input' | 'types' | 'output'
>;

export async function build({ input, types, output }: TypesBuildOptions) {
  const configPath = typeof types === 'object' ? types.configPath : undefined;

  const tsConfigContents = configPath
    ? await fs.readFile(path.join(path.resolve(), configPath), 'utf8')
    : null;
  const tsConfig = tsConfigContents
    ? await JSON.parse(tsConfigContents.toString())
    : {
        extends: '@srclaunch/dx/tsconfig.ui.json',
        include: [path.join(path.resolve(), input?.directory ?? 'src')],
      };
  const tsConfigUpdatedWithPath = {
    ...tsConfig,
    compilerOptions: {
      ...tsConfig.compilerOptions,
      declarationDir: path.join(path.resolve(), output?.directory ?? BUILD_DIR),
      listEmittedFiles: true,
      rootDir: path.join(path.resolve(), input?.directory ?? 'src'),
    },
  };
  const { options: tsOptions } = ts.parseJsonConfigFileContent(
    tsConfigUpdatedWithPath,
    ts.sys,
    path.join(path.resolve()),
  );
  const srcFiles = await fs.readdir(
    path.join(path.resolve(), input?.directory ?? 'src'),
  );
  const buildFiles = srcFiles
    .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
    .map(file => {
      return path.join(path.resolve(), input?.directory ?? 'src', file);
    });
  const program: Program = ts.createProgram(buildFiles, tsOptions);
  const emitResult = program.emit();
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  for (const diagnostic of allDiagnostics) {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!,
      );
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
