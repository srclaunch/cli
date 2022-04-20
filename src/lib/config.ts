import fs from 'fs-extra';
import path from 'node:path';

export async function getSrcLaunchConfig() {
  try {
    // const configFormats = ['js', 'json', 'ts'];

    try {
      const configPath = path.join(path.resolve(), '.srclaunch', 'config.js');

      const config = await import(configPath);

      return config.default;
    } catch (err) {
      const configPath = path.join(path.resolve(), '.srclaunch', 'config.json');

      const config = await fs.readFile(configPath);

      return await JSON.parse(config.toString());
    }
  } catch (err) {
    throw new Error(
      'Please run this command from a SrcLaunch workspace directory.',
    );
  }
}
