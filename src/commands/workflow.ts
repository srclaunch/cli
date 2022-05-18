import { Project } from '@srclaunch/types';
import { Command } from '../lib/command.js';
import { TypedFlags } from 'meow';

export type WorkflowFlags = TypedFlags<{}>;

export default new Command({
  name: 'workflow',
  description: `Commands for interacting with SrcLaunch Workflows.`,
  commands: [
    new Command<Project, WorkflowFlags>({
      name: 'run',
      description: 'Runs a SrcLaunch Workflow definition.',
      async run({ config, flags }): Promise<void> {},
    }),
  ],
});
