import meow, { AnyFlags, TypedFlags } from 'meow';
import updateNotifier, { Package } from 'update-notifier';
import * as buildCommands from './commands/build.js';
import * as changesetCommands from './commands/changesets.js';
import * as devCommands from './commands/dev.js';
import * as helpCommands from './commands/help.js';
import * as infrastructureCommands from './commands/infrastructure.js';
import * as modelCommands from './commands/models.js';
import * as previewCommands from './commands/preview.js';
import * as projectCommands from './commands/projects.js';
import * as releaseCommands from './commands/release.js';
import * as serveCommands from './commands/serve.js';
import * as testCommands from './commands/_test.js';

import { getSrcLaunchConfig } from './lib/config.js';
import { Command, CommandType, handleCommand } from './lib/command.js';
import { Project } from '@srclaunch/types';

export type { Command };
export { CommandType };

export const helpMessage = `
Usage
  $ srclaunch <command>

Commands
  build - Build SrcLaunch project if srclaunch.config.json is found in the current directory
  models
    * build - Build models into Sequelize models, Typescript definitions and JSON
  test - Run tests and collect coverage

To view information for a specific command add "help" after the command name, for example:
  $ srclaunch build help
`;

export const cli = meow(helpMessage, {
  importMeta: import.meta,
});

export async function main() {
  updateNotifier({ pkg: cli.pkg as Package }).notify();

  const command = cli.input;
  const flags = cli.flags;
  const config = await getSrcLaunchConfig();

  try {
    await handleCommand({
      cli,
      command,
      commands: [
        buildCommands.default,
        changesetCommands.default,
        devCommands.default,
        helpCommands.default,
        infrastructureCommands.default,
        modelCommands.default,
        previewCommands.default,
        projectCommands.default,
        releaseCommands.default,
        serveCommands.default,
        testCommands.default,
      ] as Command<any, TypedFlags<AnyFlags> & Record<string, unknown>>[],
      config,
      flags,
    });
  } catch (error) {
    // const { waitUntilExit } = render(
    //   // <FullScreen>
    //   <Text>{err.message}</Text>,
    //   // </FullScreen>,
    // );
    // await waitUntilExit();
    console.error(error);
  }
}

export default main();
