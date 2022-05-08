import { Project, ProjectType } from '@srclaunch/types';
import chalk from 'chalk';
import {
  promptForProjectCreate,
  promptForProjectDescription,
  promptForProjectName,
  promptForProjectOptions,
  promptForProjectType,
} from '../../prompts/generators/srclaunch/project';
import { SrcLaunchProjectConfigGenerator } from '../generators/config/srclaunch-project';

export async function createNewProjectInteractive({
  name,
  description,
  type,
}: {
  name?: string;
  description?: string;
  type?: ProjectType | string;
}) {
  const createProject = await promptForProjectCreate();

  if (createProject) {
    const projectName = name ?? (await promptForProjectName());
    const projectDescription =
      description ?? (await promptForProjectDescription());

    if (type && !Object.values(ProjectType).includes(type as ProjectType)) {
      console.error(
        `${chalk.red('✖')} ${chalk.red('Invalid project type')} ${chalk.red(
          type,
        )}`,
      );

      process.exit(1);
    }
    const projectType = type ?? (await promptForProjectType());

    const configGenerator = new SrcLaunchProjectConfigGenerator({
      description: projectDescription,
      file: { extension: 'ts', name: '.srclaunchrc' },
      type: projectType as ProjectType,
      name: projectName,
    });

    const result = await configGenerator.generate();

    console.log('result', result);
  }
}
