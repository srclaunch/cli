import {
  createDirectory,
  deleteDirectory,
  deleteFile,
  readFile,
  writeFile,
} from './file-system';
import path from 'node:path';
import ts from 'typescript';

export async function getSrcLaunchConfig() {
  try {
    // const configFormats = ['js', 'json', 'ts'];
    try {
      const configPath = path.join(path.resolve(), './.srclaunch/config.ts');
      const tempPath = path.join(path.resolve(), './.srclaunch/.temp');
      const tempConfigPath = path.join(tempPath, 'config.js');
      const configContents = await readFile(configPath);

      let result = await ts.transpileModule(configContents.toString(), {
        compilerOptions: { module: ts.ModuleKind.ESNext },
      });

      await createDirectory(tempPath);
      await writeFile(tempConfigPath, result.outputText);

      const config = await import(tempConfigPath);

      console.log(config);
      // let result = require(configPath);
      // if (result && result.__esModule && result.default) {
      //   result = result.default;
      // }
      // return result;
      await deleteFile(tempConfigPath);
      await deleteDirectory(tempPath);
    } catch (tsImportError: any) {
      console.log('tsImportError', tsImportError);
      try {
        const configPath = path.join(path.resolve(), './.srclaunch/config.js');
        let result = await import(configPath);
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
