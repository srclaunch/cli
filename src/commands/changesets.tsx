import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import Git, { CleanOptions, SimpleGit } from 'simple-git';
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
          } catch (err) {
            console.error(err);
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
