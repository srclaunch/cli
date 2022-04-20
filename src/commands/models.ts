import { Command, CommandType } from '../lib/command.js';

import { buildModels } from '../lib/models/build/index.js';
import { listModels } from '../lib/models/list.js';
import { cleanModels } from '../lib/models/build/clean.js';
import { Project, Workspace } from '@srclaunch/types';
import path from 'path';

export default new Command({
  name: '',
  description: '',
  commands: [
    new Command<Workspace>({
      name: 'clean',
      description: '',
      run: async ({ config, flags }) => {
        await cleanModels();
      },
      type: CommandType.Workspace,
    }),
    new Command<Workspace>({
      name: 'create',
      description: '',
      run: async ({ config, flags }) => {},
      type: CommandType.Workspace,
    }),
    new Command<Workspace>({
      name: 'build',
      description: '',
      run: async ({ config, flags }) => {
        await buildModels(
          path.join(path.resolve(), config.models?.path ?? 'models'),
          {
            dependencies: config.dependencies,
          },
        );
      },
      type: CommandType.Workspace,
    }),
    new Command<Workspace>({
      name: 'list',
      description: '',
      run: async ({ config, flags }) => {
        await listModels();
      },
      type: CommandType.Workspace,
    }),
    new Command<Workspace>({
      name: 'help',
      description: 'Shows help for model commands',
      run: async () => {
        console.info(
          'Available model commands are: clean, build, list, and help.',
        );
      },
      type: CommandType.Workspace,
    }),
  ],
});
