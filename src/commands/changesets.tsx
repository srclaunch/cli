import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { Command, CommandType } from '../lib/command.js';
import { render } from 'ink';
import { AppContainer } from '../components/AppContainer.js';

export default new Command({
  name: 'changesets',
  description: 'Manage changesets',
  commands: [
    new Command<
      Project,
      TypedFlags<{
        message: {
          alias: 'm';
          description: 'A message describing the changes';
          type: 'string';
        };
      }>
    >({
      name: 'add',
      description: 'Add a changeset',
      run: async ({ cli, config, flags }) => {
        const message = flags.message;

        const { waitUntilExit } = render(
          <AppContainer cliVersion={cli.pkg.version} flags={flags} />,
        );
        await waitUntilExit();
      },
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'list',
      description: 'List changesets',
      run: async ({ config, flags }) => {},
      type: CommandType.Project,
    }),
    new Command<Project>({
      name: 'help',
      description: 'Show help for changesets',
      run: async () => {
        console.info('Available changesets commands are: create, list');
      },
      type: CommandType.Project,
    }),
  ],
});
