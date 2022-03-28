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
  const fullPath = path.join(cwd, path.join(configPath));
  const configContents = await fs.readFile(fullPath);
  const config = await JSON.parse(configContents.toString());
  const buildConfig: BuildConfig = config.build;
  const { buildDir, buildPath, inputScripts } = buildConfig;

  try {
    await handleBuildCommand({
      buildDir: buildDir ? path.join(cwd, buildDir) : undefined,
      buildPath: buildPath ? path.join(cwd, buildPath) : undefined,
      inputScripts: inputScripts
        ? inputScripts.map(input => path.join(cwd, input))
        : [],
      ...config,
    });
  } catch (error) {
    throw new Exception(`Error in config file "${fullPath}"`, {
      cause: error as Error,
    });
  }
}

export async function buildModels() {
  const configPath = path.join(path.resolve(), '.applab/config.json');
  const configContents = await fs.readFile(configPath);
  const config = await JSON.parse(configContents.toString());

  if (!config) {
    throw new Exception('Missing config file ".applab/config.json"');
  }

  // const config = await JSON.parse(path.join(path.resolve(), ));
  // const config = await fs.readFile(path.join(path.resolve(), configFilePath), 'utf8');

  await cleanModels();
  await copyStubModels();

  await buildAppLabModels({ path: config.dependencies.models.path });
  await buildFromConfig(
    `.applab/${config.dependencies.models.path}/applab.config.json`,
  );

  // await build({
  //   buildPath: `.applab/`,
  //   buildTypes: true,
  //   bundle: true,
  //   format: 'esm',
  //   inputScripts: ['src/index.ts'],
  //   platform: 'browser',
  // });

  // await buildModelTypes({ path: config.dependencies.types.path });
  // await buildFromConfig(`.applab/${config.dependencies.types.path}/applab.config.json`);
  // await build({
  //   buildPath: `.applab/${config.dependencies.types.path}`,
  //   buildTypes: true,
  //   bundle: true,
  //   format: 'esm',
  //   inputScripts: ['src/index.ts'],
  //   platform: 'browser',
  // });

  // await buildSequelizeModels({ path: config.dependencies['sequelize-models'].path });
  // await buildFromConfig(`.applab/${config.dependencies['sequelize-models'].path}/applab.config.json`);
  // await build({
  //   buildPath: `.applab/${config.dependencies['sequelize-models'].path}`,
  //   buildTypes: true,
  //   bundle: true,
  //   excludeLibs: ['sequelize'],
  //   format: 'esm',
  //   inputScripts: ['src/index.ts'],
  //   platform: 'node',
  // });

  // await buildHttpClient({
  //   httpClientProjectName: config.dependencies['http-client'].repo,
  //   path: config.dependencies['http-client'].path,
  //   modelsPath: config.dependencies.models.path,
  //   typesProjectName: config.dependencies.types.repo
  // });
  // await buildFromConfig(`.applab/${config.dependencies['http-client'].path}/applab.config.json`);
  // await build({
  //   buildPath: `.applab/${config.dependencies['http-client'].path}`,
  //   buildTypes: true,
  //   bundle: true,
  //   format: 'esm',
  //   inputScripts: ['src/index.ts'],
  //   platform: 'browser',
  // });

  // await buildReduxSlices({
  //   httpClientProjectName: config.dependencies['http-client'].repo,
  //   projectPath: config.dependencies['redux-state'].path,
  //   typesProjectName: config.dependencies['types'].repo,
  // });
  // await buildFromConfig(`.applab/${config.dependencies['redux-state'].path}/applab.config.json`);
  // await build({
  //   buildPath: `.applab/${config.dependencies['redux-state'].path}`,
  //   buildTypes: true,
  //   bundle: true,
  //   format: 'esm',
  //   inputScripts: ['src/index.ts'],
  //   platform: 'browser',
  // });
}
