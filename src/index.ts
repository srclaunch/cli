import meow from 'meow';
import updateNotifier, { Package } from 'update-notifier';

import { run } from './lib/cli';

export const helpMessage = `
Usage
  $ applab <command>

Commands
  build-models - Build models into Sequelize models, Typescript definitions and JSON
  data - Commands related to building shared data types and models
  dev - Start Web/mobile apps in development mode.
  create-project - Create a new AppLab project repository
  release - Collect changes, bump and tag version, and deploy
  text - Runs tests
  update - Update SrcLaunch and AppLab dependencies

To get help for a specific command type help after the command name, for example:
  $ applab dev help
`;


export const cli = meow(helpMessage, {
  flags: {},
  importMeta: import.meta,
});

updateNotifier({ pkg: cli.pkg as Package }).notify();

run({
  cliVersion: cli.pkg.version,
  command: cli.input,
  flags: cli.flags,
});
