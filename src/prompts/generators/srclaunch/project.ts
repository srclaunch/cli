import { Project, ProjectType } from '@srclaunch/types';
import prompts from 'prompts';

export async function promptForProjectOptions(): Promise<Project> {
  const [name, description, type] = await Promise.all([
    promptForProjectName(),
    promptForProjectDescription(),
    promptForProjectType(),
  ]);

  return { name, description, type };
}

export async function promptForProjectCreate(): Promise<boolean> {
  return (
    await prompts({
      active: 'Yes',
      inactive: 'No',
      type: 'toggle',
      name: 'value',
      message: 'Would you like to create a new SrcLaunch configuration file?',
      initial: true,
    })
  ).value;
}

export async function promptForProjectName(): Promise<string> {
  return (
    await prompts({
      type: 'text',
      name: 'value',
      message: 'What do you want to name your project?',
      validate: value =>
        typeof value === 'string' &&
        value.length > 0 &&
        value.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/),
    })
  ).value;
}

export async function promptForProjectDescription(): Promise<string> {
  return (
    await prompts({
      type: 'text',
      name: 'value',
      message: 'Write a brief description of your project.',
      validate: value => typeof value === 'string' && value.length > 0,
    })
  ).value;
}

export async function promptForProjectType(): Promise<ProjectType> {
  return (
    await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose a project type.',
      choices: Object.values(ProjectType).map(type => ({
        title: type.replace('-', ' '),
        value: type as ProjectType,
      })),
      initial: 1,
    })
  ).value;
}
