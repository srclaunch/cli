import fs from 'fs-extra';
import { TypedFlags } from 'meow';
import path from 'node:path';

import { handleBuildCommand } from '../commands/build/index';
import { showHelp } from '../commands/help/index';
import { handleModelCommands } from '../commands/models/index';
import { cli } from '../index';

export async function ensureCwdIsApplabProject() {
  const projectConfigFilePath = path.join(path.resolve(), 'applab.config.json');
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
  readonly cliVersion?: string;
  readonly command: readonly string[];
  readonly flags: TypedFlags<{}> & Record<string, unknown>;
}): Promise<void> {
  try {
    switch (command[0]) {
      case 'build':
        {
          const config = await fs.readFile(
            path.join(path.resolve(), 'applab.config.json'),
            'utf8',
          );

          if (!config) {
            console.error('Missing config file "applab.config.json"');
          } else {
            try {
              const buildConfig = JSON.parse(config).build;

              await handleBuildCommand(buildConfig);
            } catch (error) {
              console.error(
                'Error in config file "applab.config.json":',
                error,
              );
            }
          }
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
  } catch (error) {
    // const { waitUntilExit } = render(
    //   // <FullScreen>
    //   <Text>{err.message}</Text>,
    //   // </FullScreen>,
    // );
    // await waitUntilExit();
    console.log('err', error);
  }
}
