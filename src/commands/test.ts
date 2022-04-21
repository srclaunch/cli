import { Command, CommandType } from '../lib/command.js';
import { run as runAvaTests } from '../lib/test/ava.js';
import { run as runJestTests } from '../lib/test/jest.js';
import { TestOptions, Project, ProjectType } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { TestTool } from '@srclaunch/types';

export default new Command({
  name: 'test',
  description: 'Commands for running tests',
  run: async ({
    config,
    flags,
  }: {
    config: Project;
    flags: TypedFlags<{}>;
  }) => {
    const options = config.test as TestOptions | TestOptions[];

    if (!options) {
      throw new Error('Missing build configuration');
    }

    if (typeof options === 'object' && !Array.isArray(options)) {
      switch (options.tool) {
        case TestTool.Jest:
          await runJestTests(options);
          return;
        case TestTool.Ava:
        default:
          await runAvaTests(options);
      }
    } else if (Array.isArray(options)) {
      for (const test of options) {
        switch (test.tool) {
          case TestTool.Jest:
            await runJestTests(test);
            return;
          case TestTool.Ava:
          default:
            await runAvaTests(test);
        }
      }
    }
  },
  commands: [
    new Command<Project>({
      name: 'ava',
      description: 'Run tests using Ava',
      run: async ({
        config,
        flags,
      }: {
        config: Project;
        flags: TypedFlags<{}>;
      }) => {
        const options = config.test as TestOptions | TestOptions[];

        if (typeof options === 'object' && !Array.isArray(options)) {
          await runAvaTests(options);
        } else if (Array.isArray(options)) {
          for (const test of options) {
            await runAvaTests(test);
          }
        }
      },
    }),
    new Command<Project>({
      name: 'jest',
      description: 'Runs tests using Jest',
      run: async ({ config, flags }) => {
        const options = config.test;

        if (typeof options === 'object' && !Array.isArray(options)) {
          await runJestTests(options);
        } else if (Array.isArray(options)) {
          for (const test of options) {
            await runJestTests(test);
          }
        }
      },
      type: CommandType.Project,
    }),
    new Command({
      name: 'help',
      description: 'Shows help for test commands',
      run: async () => {
        console.info('Available test commands are: ava, jest');
      },
      type: CommandType.Project,
    }),
  ],
});
