import chalk from 'chalk';
import { getSrcLaunchConfig } from '../lib/config.js';
import { Command } from '../lib/command.js';

export default new Command({
  name: 'config',
  description: `Shows help for ${chalk.bold('config')} commands`,
  commands: [
    new Command({
      name: 'check',
      description:
        'Checks if a SrcLaunch configuration file exists and is valid.',
      run: async () => {
        const config = await getSrcLaunchConfig();

        if (config) {
          console.info(`${chalk.green('✔')} project cleaned`);
        }
      },
    }),
    new Command({
      name: 'create',
      description:
        'Creates a SrcLaunch configuration file in the current directory.',
      run: async () => {
        const config = await getSrcLaunchConfig();

        if (config) {
          console.info(`${chalk.green('✔')} project cleaned`);
        }
      },
    }),
  ],
});
