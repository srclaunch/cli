import meow, { AnyFlags, TypedFlags } from 'meow';
import updateNotifier, { Package } from 'update-notifier';
import buildCommands from './commands/build.js';
import changesetCommands from './commands/changesets.js';
import configCommands from './commands/config.js';
import helpCommands from './commands/help.js';
import infrastructureCommands from './commands/infrastructure.js';
import installCommands from './commands/install.js';
import resetCommands from './commands/reset.js';
import modelCommands from './commands/models.js';
import projectCommands from './commands/projects.js';
import releaseCommands from './commands/release.js';
import runCommands from './commands/run.js';
import testCommands from './commands/test.js';

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
        buildCommands,
        changesetCommands,
        configCommands,
        helpCommands,
        infrastructureCommands,
        installCommands,
        resetCommands,
        modelCommands,
        projectCommands,
        releaseCommands,
        runCommands,
        testCommands,
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
