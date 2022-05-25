import chalk from 'chalk';

import { Command } from '../lib/command.js';

export default new Command({
  name: 'config',
  description: `Shows help for ${chalk.bold('config')} commands`,
  commands: [
    new Command({
      name: 'check',
      description:
        'Checks if a SrcLaunch configuration file exists and is valid',
      run: async () => {
        // const config = await getSrcLaunchConfig();
        // if (!config) {
        //   console.error(
        //     `${chalk.red('✘')} ${chalk.bold('No SrcLaunch config file found')}`,
        //   );
        // } else if (isValidSrcLaunchConfig(config)) {
        //   console.info(`${chalk.green('✔')} SrcLaunch config file is valid`);
        // } else {
        //   console.error(
        //     `${chalk.red('✘')} ${chalk.bold(
        //       'SrcLaunch config file is invalid',
        //     )}`,
        //   );
        // }
      },
    }),
    new Command({
      name: 'create',
      description:
        'Creates a SrcLaunch configuration file in the current directory.',
      run: async () => {
        // const config = await getSrcLaunchConfig();
        // if (config) {
        //   console.info(`${chalk.green('✔')} project cleaned`);
        // }
      },
    }),
  ],
});
