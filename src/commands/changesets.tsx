import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { add, commit } from '../lib/git';
import { Command, CommandType } from '../lib/command.js';
import { render } from 'ink';
import { AppContainer } from '../containers/AppContainer.js';
import { InteractiveModeFlag } from '../lib/flags.js';
import chalk from 'chalk';
import { createChangeset } from '../lib/changesets';

export default new Command({
  name: 'changesets',
  description: 'Manage changesets',
  commands: [
    new Command<
      Project,
      TypedFlags<
        InteractiveModeFlag & {
          message: {
            alias: 'm';
            description: 'A message describing the changes';
            isRequired: true;
            type: 'string';
          };
          scope: {
            alias: 's';
            description: 'The scope of the changes';
            isRequired: false;
            type: 'string';
          };
          type: {
            alias: 't';
            description: 'The type of changes made';
            isRequired: true;
            type: 'string';
          };
        }
      >
    >({
      name: 'add',
      description: 'Create a changeset',
      run: async ({ cli, flags }) => {
        const { message, scope, type } = flags;
        if (flags.interactive) {
          const { waitUntilExit } = render(
            <AppContainer
              initialTab="Changes"
              cliVersion={cli.pkg.version}
              flags={flags}
            />,
          );
          await waitUntilExit();
        } else {
          try {
            await createChangeset({ message, scope, type });
            console.log(`${chalk.green('✔')} added new changeset`);
          } catch (err) {
            console.error('commit err', err);
          }
        }
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
