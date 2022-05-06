import {
  createDirectory,
  deleteDirectory,
  deleteFile,
  fileExists,
  readFile,
  writeFile,
} from './file-system';
import path from 'node:path';
import ts from 'typescript';
import { SrcLaunchConfig } from '@srclaunch/types';

export async function getSrcLaunchConfig(): Promise<SrcLaunchConfig> {
  try {
    const tsConfigPath = path.resolve(`./.srclaunch/config.ts`);
    const jsConfigPath = path.resolve(`./.srclaunch/config.js`);
    const jsonConfigPath = path.resolve(`./.srclaunch/config.json`);

    if (await fileExists(tsConfigPath)) {
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

      await deleteFile(tempConfigPath);
      await deleteDirectory(tempPath);

      if (tempConfig && tempConfig.default) {
        return tempConfig.default;
      }

      return tempConfig;
    }

    if (await fileExists(jsConfigPath)) {
      let result = await import(jsConfigPath);
      if (result && result.default) {
        return result.default;
      }
      return result;
    }

    if (await fileExists(jsonConfigPath)) {
      const config = await readFile(jsonConfigPath);

      return await JSON.parse(config.toString());
    }

    throw new Error(
      'Could not find .srclaunch/config.ts, .srclaunch/config.js, or .srclaunch/config.json',
    );
  } catch (err) {
    console.error(err);
    throw new Error(
      'Please run this command from a SrcLaunch project or workspace directory.',
    );
  }
}
