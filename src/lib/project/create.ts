import { Project, ProjectType } from '@srclaunch/types';
import chalk from 'chalk';
import {
  promptForProjectCreate,
  promptForProjectDescription,
  promptForProjectName,
  promptForProjectOptions,
  promptForProjectType,
} from '../../prompts/generators/srclaunch/project';
import { generateSrcLaunchProjectConfig } from '../generators/config/srclaunch/project';
import { generateFile } from '../generators/file';

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

    return await generateFile({
      contents: await generateSrcLaunchProjectConfig({
        description: projectDescription,
        type: projectType as ProjectType,
        name: projectName,
      }),
      name: '.srclaunchrc',
      extension: 'ts',
    });
  }
}
