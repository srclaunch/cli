import { Project } from '@srclaunch/types';
// import { render } from 'ink';
// import { AppContainer } from '../components/AppContainer.js';
import { Command, CommandType } from '../lib/command.js';

export default new Command<Project>({
  name: 'install',
  description: 'Install project dependencies from .srclaunch/config.js',
  run: async ({ cli, flags }) => {
    // const { waitUntilExit } = render(
    //   <AppContainer cliVersion={cli.pkg.version} flags={flags} />,
    // );
    // await waitUntilExit();
  },
  commands: [
    new Command<Project>({
      name: 'help',
      description: 'Shows help for install commands',
      run: async () => {
        console.info('Available install commands are:  help');
      },
      type: CommandType.Project,
    }),
  ],
});
