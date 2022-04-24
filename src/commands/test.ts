import { Command, CommandType } from '../lib/command.js';
import { run as runAvaTests } from '../lib/test/node.js';
import { run as runC8Coverage } from '../lib/test/coverage.js';
import { run as runJestTests } from '../lib/test/react.js';
import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { TestTool } from '@srclaunch/types';

type TestFlags = TypedFlags<{
  coverage: {
    alias: 'c';
    default: false;
    description: 'Collect test coverage after test run';
    type: 'boolean';
  };
  match: {
    alias: 'm';
    description: 'Run tests matching the specified pattern';
    type: 'string';
  };
  watch: {
    alias: 'w';
    description: 'Watch for changes and run tests automatically';
    type: 'boolean';
  };
}>;

export default new Command<Project, TestFlags>({
  name: 'test',
  description: 'Commands for running tests',
  run: async ({ config, flags }: { config: Project; flags: TestFlags }) => {
    if (typeof config.test === 'object' && !Array.isArray(config.test)) {
      switch (config.test.tool) {
        case TestTool.Jest:
          await runJestTests({
            config: config.test,
            match: flags.match,
            watch: flags.watch,
          });
          return;
        case TestTool.Ava:
        default:
          await runAvaTests({
            config: config.test,
            match: flags.match,
            watch: flags.watch,
          });
      }

      if (config.test.coverage || flags.coverage) {
        await runC8Coverage(config.test);
      }
    } else if (Array.isArray(config.test)) {
      for (const test of config.test) {
        switch (test.tool) {
          case TestTool.Jest:
            await runJestTests({
              config: test,
              match: flags.match,
              watch: flags.watch,
            });
            return;
          case TestTool.Ava:
          default:
            await runAvaTests({
              config: test,
              match: flags.match,
              watch: flags.watch,
            });
        }

        if (test.coverage || flags.coverage) {
          await runC8Coverage(test);
        }
      }
    }
  },
  commands: [
    new Command<Project, TestFlags>({
      name: 'node',
      description: 'Run tests using Ava',
      run: async ({ config, flags }: { config: Project; flags: TestFlags }) => {
        if (typeof config.test === 'object' && !Array.isArray(config.test)) {
          await runAvaTests({
            config: config.test,
            match: flags.match,
            watch: flags.watch,
          });
        } else if (Array.isArray(config.test)) {
          for (const test of config.test) {
            await runAvaTests({
              config: test,
              match: flags.match,
              watch: flags.watch,
            });
          }
        }
      },
    }),
    new Command<Project, TestFlags>({
      name: 'react',
      description: 'Runs tests using Jest',
      run: async ({ config, flags }) => {
        if (typeof config.test === 'object' && !Array.isArray(config.test)) {
          await runJestTests({
            config: config.test,
            match: flags.match,
            watch: flags.watch,
          });
        } else if (Array.isArray(config.test)) {
          for (const test of config.test) {
            await runJestTests({
              config: test,
              match: flags.match,
              watch: flags.watch,
            });
          }
        }
      },
      type: CommandType.Project,
    }),
    new Command<Project, TestFlags>({
      name: 'coverage',
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
