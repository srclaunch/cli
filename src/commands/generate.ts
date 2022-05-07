import chalk from 'chalk';
import prompts from 'prompts';
import { Project, ProjectType } from '@srclaunch/types';
import { getSrcLaunchConfig } from '../lib/config.js';
import { Command } from '../lib/command.js';
import { SrcLaunchProjectConfigGenerator } from '../lib/generators/config/srclaunch-project.js';
import { TypedFlags } from 'meow';

export type GenerateSrcLaunchProjectFlags = TypedFlags<{
  name: {
    type: 'string';
    required: true;
  };
  description: {
    type: 'string';
    required: true;
  };
  type: {
    type: 'string';
    required: true;
  };
}>;

export default new Command({
  name: 'generate',
  description: `Shows help for ${chalk.bold('generate')} commands`,
  commands: [
    new Command<Project, GenerateSrcLaunchProjectFlags>({
      name: 'srclaunch-project-config',
      description:
        "Generates a SrcLaunch project config file if one doesn't exist already.",
      async run({ config, flags }): Promise<void> {
        const name =
          flags.name ??
          (
            await prompts({
              type: 'text',
              name: 'value',
              message: 'What do you want to name your project?',
              validate: value =>
                typeof value === 'string' &&
                value.length > 0 &&
                value.match(
                  /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
                ),
            })
          ).value;

        const description =
          flags.description ??
          (
            await prompts({
              type: 'text',
              name: 'value',
              message: 'Write a brief description of your project.',
              validate: value => typeof value === 'string' && value.length > 0,
            })
          ).value;

        const type =
          flags.type ??
          (
            await prompts({
              type: 'select',
              name: 'value',
              message: 'Choose a project type.',
              choices: Object.values(ProjectType).map(type => ({
                title: type,
                value: type,
              })),
              initial: 1,
            })
          ).value;

        console.log('config exists', Boolean(config));

        const configGenerator = new SrcLaunchProjectConfigGenerator({
          description,
          file: { extension: 'ts', name: '.srclaunchrc' },
          type,
          name,
        });

        const result = await configGenerator.generate();

        console.log('result', result);
      },
    }),
  ],
});
