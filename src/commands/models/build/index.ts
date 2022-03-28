import { Exception } from '@srclaunch/exceptions';
import fs from 'fs-extra';
import path from 'node:path';

import { BuildConfig } from '../../../types/build';
import { handleBuildCommand } from '../../build/index';
import { cleanModels } from './clean';
import { buildAppLabModels } from './outputs/applab';
import { buildHttpClient } from './outputs/http-client';
// import { buildJSONModels } from './outputs/json';
import { buildReduxSlices } from './outputs/redux';
import { buildSequelizeModels } from './outputs/sequelize';
import { buildModelTypes } from './outputs/types';
import { copyStubModels } from './stubs/index';

export async function buildFromConfig(configPath: string) {
  const cwd = path.resolve();
  const fullPath = path.join(cwd, path.join(configPath, 'applab.config.json'));

  try {
    const configContents = await fs.readFile(fullPath);
    const config = await JSON.parse(configContents.toString());
    const buildConfig: BuildConfig[] = config.build.map(
      (build: BuildConfig) => ({
        buildDir: build.buildDir
          ? path.join(cwd, configPath, build.buildDir)
          : undefined,
        buildPath: build.buildPath
          ? path.join(cwd, configPath, build.buildPath)
          : undefined,
        inputScripts: build.inputScripts
          ? build.inputScripts.map(input => path.join(cwd, configPath, input))
          : [],
      }),
    );

    await handleBuildCommand(buildConfig);
  } catch (error) {
    throw new Exception(`Error in config file "${fullPath}"`, {
      cause: error as Error,
    });
  }
}

export async function buildModels() {
  console.info('Starting build of Core Object models...');

  const configPath = path.join(path.resolve(), '.applab/config.json');
  const configContents = await fs.readFile(configPath);
  const config = await JSON.parse(configContents.toString());

  if (!config) {
    throw new Exception('Missing config file ".applab/config.json"');
  }

  console.info('Cleaning models...');
  await cleanModels();

  console.info('Copying stubs...');
  await copyStubModels();

  console.info('Building AppLab models...');
  await buildAppLabModels({ path: config.dependencies.models.path });
  await buildFromConfig(`.applab/${config.dependencies.models.path}`);

  // console.info('Creating model type definitions...');
  // await buildModelTypes({ path: config.dependencies.types.path });
  // await buildFromConfig(`.applab/${config.dependencies.types.path}`);

  // console.info('Creating Sequelize models...');
  // await buildSequelizeModels({
  //   path: config.dependencies['sequelize-models'].path,
  // });
  // await buildFromConfig(
  //   `.applab/${config.dependencies['sequelize-models'].path}`,
  // );

  // console.info('Building HTTP client...');
  // await buildHttpClient({
  //   httpClientProjectName: config.dependencies['http-client'].repo,
  //   modelsPath: config.dependencies.models.path,
  //   path: config.dependencies['http-client'].path,
  //   typesProjectName: config.dependencies.types.repo,
  // });
  // await buildFromConfig(`.applab/${config.dependencies['http-client'].path}`);

  // console.info('Building Redux state...');
  // await buildReduxSlices({
  //   httpClientProjectName: config.dependencies['http-client'].repo,
  //   projectPath: config.dependencies['redux-state'].path,
  //   typesProjectName: config.dependencies.types.repo,
  // });
  // await buildFromConfig(`.applab/${config.dependencies['redux-state'].path}`);
}
