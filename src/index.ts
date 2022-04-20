import meow from 'meow';
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

import { getSrcLaunchConfig } from './lib/config.js';
import { Command, CommandType, handleCommand } from './lib/command.js';

export type { Command };
export { CommandType };

export const helpMessage = `
Usage
  $ srclaunch <command>

Commands
  build - Build SrcLaunch project if srclaunch.config.json is found in the current directory
  models
    * build - Build models into Sequelize models, Typescript definitions and JSON
  dev - Start Web/mobile apps in development mode.
  project
    * create - Create a new SrcLaunch project  
  release - Collect changes, bump and tag version, and deploy

To get help for a specific command type help after the command name, for example:
  $ srclaunch dev help
`;

export const cli = meow(helpMessage, {
  flags: {
    clean: {
      type: 'boolean',
    },
    config: {
      type: 'string',
      alias: 'c',
    },
    help: {
      type: 'boolean',
      alias: 'h',
    },
    version: {
      type: 'boolean',
      alias: 'v',
    },
  },
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
      ],
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
