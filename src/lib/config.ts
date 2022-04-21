import { readFile } from './file-system';
import path from 'node:path';

export async function getSrcLaunchConfig() {
  try {
    // const configFormats = ['js', 'json', 'ts'];

    try {
      const configPath = path.join(path.resolve(), './.srclaunch/config.js');
      const config = await import(configPath);

      console.info(`Loaded config from ${configPath}`);
      return config.default;
    } catch (jsImportError: any) {
      const configPath = path.join(path.resolve(), '.srclaunch', 'config.json');

      try {
        const config = await readFile(configPath);

        console.info(`Loaded config from ${configPath}`);

        return await JSON.parse(config.toString());
      } catch (jsonReadError: any) {
        throw new Error(
          `Could not read config file: ${configPath}. ${jsonReadError.message}`,
        );
      }
    }
  } catch (err) {
    throw new Error(
      'Please run this command from a SrcLaunch project or workspace directory.',
    );
  }
}
