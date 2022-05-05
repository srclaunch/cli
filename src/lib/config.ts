import { readFile } from './file-system';
import path from 'node:path';
import ts, { ModuleKind, Program } from 'typescript';

export async function getSrcLaunchConfig() {
  try {
    // const configFormats = ['js', 'json', 'ts'];
    try {
      const configPath = path.join(path.resolve(), './.srclaunch/config.ts');
      console.log('configPath,', configPath);
      const program = ts.createProgram([configPath], {
        module: ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext,
        esModuleInterop: true,
      });

      console.log('program', program);

      const emit = program.emit();

      console.log(JSON.stringify(emit));
      // let result = require(configPath);
      // if (result && result.__esModule && result.default) {
      //   result = result.default;
      // }
      // return result;
    } catch (tsImportError: any) {
      console.log('tsImportError', tsImportError);
      try {
        const configPath = path.join(path.resolve(), './.srclaunch/config.js');
        let result = require(configPath);
        if (result && result.__esModule && result.default) {
          result = result.default;
        }
        return result;
      } catch (jsImportError: any) {
        console.log('jsImportError', jsImportError);
        const configPath = path.join(
          path.resolve(),
          '.srclaunch',
          'config.json',
        );

        try {
          const config = await readFile(configPath);

          return await JSON.parse(config.toString());
        } catch (jsonReadError: any) {
          throw new Error(
            `Could not read config file: ${configPath}. ${jsonReadError.message}`,
          );
        }
      }
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      'Please run this command from a SrcLaunch project or workspace directory.',
    );
  }
}
