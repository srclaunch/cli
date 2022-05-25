import { ProjectType } from '@srclaunch/types';
import chalk from 'chalk';
import { generateSrcLaunchProjectConfig, writeFile } from '@srclaunch/logic';

import {
  promptForProjectCreate,
  promptForProjectDescription,
  promptForProjectName,
  promptForProjectType,
} from '../../prompts/generators/srclaunch/project';

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

    return await writeFile(
      '.srclaunchrc.ts',
      await generateSrcLaunchProjectConfig({
        project: {
          description: projectDescription,
          type: projectType as ProjectType,
          name: projectName,
        },
      }),
    );
  }
}
