import fs from 'fs-extra';
import { TypedFlags } from 'meow';
import path from 'path';
import { cli } from '../index.js';
import { showHelp } from '../commands/help/index.js';
import { handleModelCommands } from '../commands/models/index.js';
import { handleBuildCommand } from '../commands/build/index.js';

export async function ensureCwdIsApplabProject() {
  const projectConfigFilePath = path.join('./.applab/config.json');
  const isCwdProjectLevel = Boolean(await fs.stat(projectConfigFilePath));

  if (!isCwdProjectLevel) {
    throw new Error(
      'Please run this command from the AppLab project directory.',
    );
  }
}

export async function run({
  cliVersion,
  command,
  flags,
}: {
  cliVersion?: string;
  command: string[];
  flags: TypedFlags<{}> & Record<string, unknown>;
}): Promise<void> {
  try {
    switch (command[0]) {
      case 'build':
        const config = await fs.readFile(path.join(path.resolve(), 'applab.config.json'), 'utf8');

        if (!config) {
          console.error('Missing config file "applab.config.json"');
        }

        try {
          const buildConfig = JSON.parse(config).build;
          await handleBuildCommand(buildConfig);  
        } catch (err) {
          console.error('Error in config file "applab.config.json": ', err);
        }
  
        break;
      case 'models':
        // await buildModels();
        await handleModelCommands(command[1]);
        break;
      case 'dev':
        console.log('why hi here?');
        // await runDev({ cliVersion, flags });
        break;
      case 'help':
        showHelp();
        break;
      default:
        console.error('Unknown command');
        cli.showHelp();
        break;
    }
  } catch (err) {
    // const { waitUntilExit } = render(
    //   // <FullScreen>
    //   <Text>{err.message}</Text>,
    //   // </FullScreen>,
    // );
    // await waitUntilExit();
    console.log('err', err);
  }
}
