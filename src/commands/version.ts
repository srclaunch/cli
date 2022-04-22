import { Command } from '../lib/command.js';

export default new Command({
  name: 'version',
  description: 'Shows CLI tool version',
  run: async ({ cli }) => {
    cli.showVersion();
  },
});
