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

      const tempConfig = await import(tempConfigPath);
      console.log('tempConfig1', tempConfig);
      await deleteFile(tempConfigPath);
      await deleteDirectory(tempPath);

      console.log('tempConfig2', tempConfig);

      if (tempConfig && tempConfig.__esModule && tempConfig.default) {
        return tempConfig.default;
      }

      return tempConfig;
    } catch (tsImportError: any) {
      try {
        const configPath = path.join(path.resolve(), './.srclaunch/config.js');
        let result = await import(configPath);
        if (result && result.__esModule && result.default) {
          result = result.default;
        }
        return result;
      } catch (jsImportError: any) {
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
