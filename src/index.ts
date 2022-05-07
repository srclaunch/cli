import meow, { AnyFlags, TypedFlags } from 'meow';
import updateNotifier, { Package } from 'update-notifier';
import * as buildCommands from './commands/build.js';
import * as changesetCommands from './commands/changesets.js';
import * as helpCommands from './commands/help.js';
import * as infrastructureCommands from './commands/infrastructure.js';
import * as installCommands from './commands/install.js';
import * as resetCommands from './commands/reset.js';
import * as modelCommands from './commands/models.js';
import * as projectCommands from './commands/projects.js';
import * as releaseCommands from './commands/release.js';
import * as runCommands from './commands/run.js';
import * as testCommands from './commands/test.js';

import { getSrcLaunchConfig } from './lib/config.js';
import { Command, CommandType, handleCommand } from './lib/command.js';
import { InteractiveModeFlag } from './lib/flags.js';

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
  try {
    const command = cli.input;
    const flags = cli.flags as TypedFlags<InteractiveModeFlag>;
    const config = await getSrcLaunchConfig();

    updateNotifier({ pkg: cli.pkg as Package }).notify();

    await handleCommand({
      cli,
      command,
      commands: [
        buildCommands.default,
        changesetCommands.default,
        helpCommands.default,
        infrastructureCommands.default,
        installCommands.default,
        resetCommands.default,
        modelCommands.default,
        projectCommands.default,
        releaseCommands.default,
        runCommands.default,
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
