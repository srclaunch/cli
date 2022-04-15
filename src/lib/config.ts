import fs from 'fs-extra';
import path from 'node:path';

export async function getProjectConfig() {
  try {
    const configPath = path.join(
      path.resolve(),
      '.srclaunch',
      'project.config.ts',
    );

    const projectConfig = await fs.readFile(configPath);

    return JSON.parse(projectConfig.toString());
  } catch (err) {
    throw new Error(
      'Please run this command from a SrcLaunch project directory.',
    );
  }
}

export async function inProjectDirectory() {
  const configPath = path.join(
    path.resolve(),
    '.srclaunch',
    'project.config.ts',
  );

  return await fs.statSync(configPath);
}

export async function getWorkspaceConfig() {
  try {
    const configPath = path.join(
      path.resolve(),
      '.srclaunch',
      'workspace.config.ts',
    );

    const workspaceConfig = await fs.readFile(configPath);

    return JSON.parse(workspaceConfig.toString());
  } catch (err) {
    throw new Error(
      'Please run this command from a SrcLaunch workspace directory.',
    );
  }
}

export async function inWorkspaceDirectory() {
  const configPath = path.join(
    path.resolve(),
    '.srclaunch',
    'workspace.config.ts',
  );

  return await fs.statSync(configPath);
}
