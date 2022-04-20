import { Project } from '@srclaunch/types';
// import { render } from 'ink';
// import { AppContainer } from '../components/AppContainer.js';
import { Command, CommandType } from '../lib/command.js';

export default new Command({
  name: 'dev',
  description: 'Development environment commands',
  commands: [
    new Command<Project>({
      name: 'start',
      description: 'Launches the local development environment.',
      run: async ({ cli, flags }) => {
        // const { waitUntilExit } = render(
        //   <AppContainer cliVersion={cli.pkg.version} flags={flags} />,
        // );
        // await waitUntilExit();
      },
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'help',
      description: 'Shows help for dev commands',
      run: async () => {
        console.info('Available dev commands are: start, help');
      },
      type: CommandType.Project,
    }),
  ],
});
