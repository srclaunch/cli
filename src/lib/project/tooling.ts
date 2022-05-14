import {
  CodeFormatterTool,
  CodeLinterTool,
  Project,
  ProjectType,
  StaticTypingTool,
} from '@srclaunch/types';
import chalk from 'chalk';
import path from 'path';
import { PRETTIER_CONFIG_CONTENT } from '../../constants/formatters';
import {
  ESLINT_CONFIG_CONTENT,
  ESLINT_UI_CONFIG_CONTENT,
  STYLELINT_CONFIG_CONTENT,
  STYLELINT_UI_CONFIG_CONTENT,
} from '../../constants/linters';
import {
  TYPESCRIPT_CONFIG_CONTENT,
  TYPESCRIPT_UI_CONFIG_CONTENT,
} from '../../constants/static-typing';
import { writeFile } from '../file-system';

export async function writeToolingConfiguration({
  formatters = [],
  linters = [],
  project,
  staticTyping = [],
}: {
  formatters?: CodeFormatterTool[];
  linters?: CodeLinterTool[];
  project: Project;
  staticTyping?: StaticTypingTool[];
}) {
  if (staticTyping) {
    for (const tool of staticTyping) {
      switch (tool) {
        case StaticTypingTool.TypeScript:
          const uiConfig =
            project.type === ProjectType.WebApplication ||
            project.type === ProjectType.ComponentLibrary;

          await writeFile(
            path.resolve('./tsconfig.json'),
            uiConfig ? TYPESCRIPT_UI_CONFIG_CONTENT : TYPESCRIPT_CONFIG_CONTENT,
          );
          // console.info(`${chalk.green('✔')} added TypeScript config`);
          break;
        default:
          break;
      }
    }

    if (formatters) {
      for (const formatter of formatters) {
        switch (formatter) {
          case CodeFormatterTool.Prettier:
            await writeFile(
              path.resolve('./.prettierrc.cjs'),
              PRETTIER_CONFIG_CONTENT,
            );
            // console.info(`${chalk.green('✔')} added Prettier config`);
            break;
          default:
            break;
        }
      }
    }

    if (linters) {
      const ui =
        project.type === ProjectType.WebApplication ||
        project.type === ProjectType.ComponentLibrary;

      for (const linter of linters) {
        switch (linter) {
          case CodeLinterTool.ESLint:
            await writeFile(
              path.resolve('./.eslintrc.cjs'),
              ui ? ESLINT_UI_CONFIG_CONTENT : ESLINT_CONFIG_CONTENT,
            );
            // console.info(`${chalk.green('✔')} added ESLint config`);
            break;
          case CodeLinterTool.Stylelint:
            await writeFile(
              path.resolve('./.stylelintrc.js'),
              ui ? STYLELINT_UI_CONFIG_CONTENT : STYLELINT_CONFIG_CONTENT,
            );
            // console.info(`${chalk.green('✔')} added Stylelint config`);
            break;
          default:
            break;
        }
      }
    }
  }
}
