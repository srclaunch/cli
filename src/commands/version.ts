import { Command } from '../lib/command.js';

export default new Command({
  name: 'version',
  description:
    'Commands for bumping the version of the project according to semantic versioning.',
  run: async ({ cli }) => {
    cli.showVersion();
  },
});
