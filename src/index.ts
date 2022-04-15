import meow from 'meow';
import updateNotifier, { Package } from 'update-notifier';
import build from './commands/build';
import changesets from './commands/changesets';
import dev from './commands/dev';
import help from './commands/help';
import infrastructure from './commands/infrastructure';
import models from './commands/models';
import preview from './commands/preview';
import projects from './commands/projects';
import release from './commands/release';
import serve from './commands/serve';

import {
  getProjectConfig,
  getWorkspaceConfig,
  inWorkspaceDirectory,
} from './lib/config';
import { Command, CommandType, handleCommand } from './lib/command';

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
  flags: {},
  importMeta: import.meta,
});

updateNotifier({ pkg: cli.pkg as Package }).notify();

const command = cli.input;
const flags = cli.flags;
const inWorkspaceDir = await inWorkspaceDirectory();

try {
  await handleCommand({
    cli,
    command,
    commands: [
      build,
      changesets,
      dev,
      help,
      infrastructure,
      models,
      preview,
      projects,
      release,
      serve,
    ],
    config: inWorkspaceDir
      ? await getWorkspaceConfig()
      : await getProjectConfig(),
    flags,
    type: inWorkspaceDir ? CommandType.Workspace : CommandType.Project,
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
