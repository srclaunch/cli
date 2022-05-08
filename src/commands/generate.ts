import chalk from 'chalk';
import prompts from 'prompts';
import { Project, ProjectType } from '@srclaunch/types';
import { getSrcLaunchConfig } from '../lib/config.js';
import { Command } from '../lib/command.js';
import { SrcLaunchProjectConfigGenerator } from '../lib/generators/config/srclaunch/project.js';
import { TypedFlags } from 'meow';
import {
  promptForProjectDescription,
  promptForProjectName,
  promptForProjectType,
} from '../prompts/generators/srclaunch/project.js';
import { createNewProjectInteractive } from '../lib/project/create.js';

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
  description: `Generate code, configuration, and files for various patterns and libraries.`,
  commands: [
    new Command<Project, GenerateSrcLaunchProjectFlags>({
      name: 'srclaunch-project-config',
      description:
        "Generates a SrcLaunch project config file if one doesn't exist already.",
      async run({ config, flags }): Promise<void> {
        const result = await createNewProjectInteractive({
          name: flags.name,
          description: flags.description,
          type: flags.type,
        });

        console.info('resulttt', result);
      },
    }),
  ],
});
