import { Command } from '../lib/command';

export default new Command({
  name: 'help',
  description: 'Shows help for commands',
  run: async ({ cli }) => {
    cli.showHelp();
  },
});
