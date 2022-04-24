import { Project } from '@srclaunch/types';
import { AnyFlag, TypedFlags } from 'meow';
import Git, { SimpleGit } from 'simple-git';
import { Command, CommandType } from '../lib/command.js';
import { render } from 'ink';
import { AppContainer } from '../containers/AppContainer.js';
import { InteractiveModeFlag } from '../lib/flags.js';

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
            isRequired: true;
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
      run: async ({ cli, config, flags }) => {
        const message = flags.message;

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
            const git: SimpleGit = Git();
            await git.add('.');
            await git.commit(message);
            console.log('✔ added new changeset');
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
