import { Command, CommandType } from '../lib/command.js';
import { run as runAvaTests } from '../lib/test/ava.js';
import { run as runC8Coverage } from '../lib/test/c8.js';
import { run as runJestTests } from '../lib/test/jest.js';
import { TestOptions, Project, ProjectType } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { TestTool } from '@srclaunch/types';

type TestFlags = TypedFlags<{
  match: {
    alias: 'm';
    description: 'Run tests matching the specified pattern';
    type: 'string';
  };
}>;

const defaultTestOptions: TestOptions = {
  concurrency: undefined,
  coverage: {
    thresholds: {
      global: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      },
    },
  },
  failFast: true,
  failNoTests: false,
  tool: TestTool.Ava,
  verbose: true,
};

export default new Command<Project, TestFlags>({
  name: 'test',
  description: 'Commands for running tests',
  run: async ({ config, flags }: { config: Project; flags: TestFlags }) => {
    const options = ({ ...defaultTestOptions, ...config.test } ??
      defaultTestOptions) as TestOptions | TestOptions[];

    if (typeof options === 'object' && !Array.isArray(options)) {
      switch (options.tool) {
        case TestTool.Jest:
          await runJestTests(options, flags.match);
          return;
        case TestTool.Ava:
        default:
          await runAvaTests(options, flags.match);
      }

      if (options.coverage) {
        await runC8Coverage(options);
      }
    } else if (Array.isArray(options)) {
      for (const test of options) {
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
        const options = (config.test ?? defaultTestOptions) as
          | TestOptions
          | TestOptions[];

        if (typeof options === 'object' && !Array.isArray(options)) {
          await runAvaTests(options, flags.match);
        } else if (Array.isArray(options)) {
          for (const test of options) {
            await runAvaTests(test, flags.match);
          }
        }
      },
    }),
    new Command<Project, TestFlags>({
      name: 'jest',
      description: 'Runs tests using Jest',
      run: async ({ config, flags }) => {
        const options = (config.test ?? defaultTestOptions) as
          | TestOptions
          | TestOptions[];

        if (typeof options === 'object' && !Array.isArray(options)) {
          await runJestTests(options, flags.match);
        } else if (Array.isArray(options)) {
          for (const test of options) {
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
        const options = (config.test ?? defaultTestOptions) as
          | TestOptions
          | TestOptions[];

        if (typeof options === 'object' && !Array.isArray(options)) {
          await runC8Coverage(options);
        } else if (Array.isArray(options)) {
          for (const test of options) {
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
