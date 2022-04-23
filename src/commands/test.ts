import { Command, CommandType } from '../lib/command.js';
import { run as runAvaTests } from '../lib/test/ava.js';
import { run as runC8Coverage } from '../lib/test/c8.js';
import { run as runJestTests } from '../lib/test/jest.js';
import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { TestTool } from '@srclaunch/types';

type TestFlags = TypedFlags<{
  match: {
    alias: 'm';
    description: 'Run tests matching the specified pattern';
    type: 'string';
  };
}>;

export default new Command<Project, TestFlags>({
  name: 'test',
  description: 'Commands for running tests',
  run: async ({ config, flags }: { config: Project; flags: TestFlags }) => {
    console.info('Running tests...');
    if (typeof config.test === 'object' && !Array.isArray(config.test)) {
      switch (config.test.tool) {
        case TestTool.Jest:
          await runJestTests(config.test, flags.match);
          return;
        case TestTool.Ava:
        default:
          await runAvaTests(config.test, flags.match);
      }

      if (config.test.coverage) {
        await runC8Coverage(config.test);
      }
    } else if (Array.isArray(config.test)) {
      for (const test of config.test) {
        switch (test.tool) {
          case TestTool.Jest:
            await runJestTests(test, flags.match);
            return;
          case TestTool.Ava:
          default:
            await runAvaTests(test, flags.match);
        }

        if (test.coverage) {
          await runC8Coverage(test);
        }
      }
    }
  },
  commands: [
    new Command<Project, TestFlags>({
      name: 'ava',
      description: 'Run tests using Ava',
      run: async ({ config, flags }: { config: Project; flags: TestFlags }) => {
        if (typeof config.test === 'object' && !Array.isArray(config.test)) {
          await runAvaTests(config.test, flags.match);
        } else if (Array.isArray(config.test)) {
          for (const test of config.test) {
            await runAvaTests(test, flags.match);
          }
        }
      },
    }),
    new Command<Project, TestFlags>({
      name: 'jest',
      description: 'Runs tests using Jest',
      run: async ({ config, flags }) => {
        if (typeof config.test === 'object' && !Array.isArray(config.test)) {
          await runJestTests(config.test, flags.match);
        } else if (Array.isArray(config.test)) {
          for (const test of config.test) {
            await runJestTests(test, flags.match);
          }
        }
      },
      type: CommandType.Project,
    }),
    new Command<Project, TestFlags>({
      name: 'c8',
      description: 'Generates coverage reports',
      run: async ({ config, flags }) => {
        if (typeof config.test === 'object' && !Array.isArray(config.test)) {
          await runC8Coverage(config.test);
        } else if (Array.isArray(config.test)) {
          for (const test of config.test) {
            await runC8Coverage(test);
          }
        }
      },
      type: CommandType.Project,
    }),
    new Command<Project, TestFlags>({
      name: 'help',
      description: 'Shows help for test commands',
      run: async () => {
        console.info('Available test commands are: ava, jest');
      },
      type: CommandType.Project,
    }),
  ],
});
