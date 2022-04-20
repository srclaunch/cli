// import fs from 'fs-extra';
// import path from 'node:path';
// import { Exception } from '@srclaunch/exceptions';
import { BuildFormat, BuildOptions, Workspace } from '@srclaunch/types';
import { build as esbuild, ESBuildOptions } from '../../build/esbuild.js';
// import { build as vite, ViteBuildOptions } from '../../build/vite';
// import { build as buildTypes, TypesBuildOptions } from '../../build/types';
// import { cleanModels } from './clean';
import { buildSrcLaunchModels } from './outputs/srclaunch.js';
// import { buildHttpClient } from './outputs/http-client';
// // import { buildJSONModels } from './outputs/json';
// import { buildReduxSlices } from './outputs/redux';
// import { buildSequelizeModels } from './outputs/sequelize';
// import { buildModelTypes } from './outputs/types';
import { copyStubModels } from './stubs/index.js';

export type ModelsBuildOptions = {
  paths: {
    dependencies: Workspace['dependencies'];
  };
};

export async function buildModels(
  path: string,
  { dependencies }: { dependencies: Workspace['dependencies'] },
) {
  console.info('Building Core Object dependencies...');

  console.info('Adding out of box Core Objects...');
  await copyStubModels();

  console.info('Building SrcLaunch models...');
  await buildSrcLaunchModels(path, dependencies.models.path);
  await esbuild({
    format: BuildFormat.ESM,
    rootDir: dependencies.models.path,
  });

  // console.info('Creating model type definitions...');
  // await buildModelTypes(projectConfig.dependencies.types.path);
  // await buildTypes(projectConfig.dependencies.types.path);

  // console.info('Creating Sequelize models...');
  // await buildSequelizeModels(
  //   projectConfig.dependencies['sequelize-models'].path,
  // );
  // await buildProject(projectConfig.dependencies['sequelize-models'].path);

  // console.info('Building HTTP client...');
  // await buildHttpClient({
  //   httpClientProjectName: projectConfig.dependencies['http-client'].repo,
  //   modelsPath: projectConfig.dependencies.models.path,
  //   path: projectConfig.dependencies['http-client'].path,
  //   typesProjectName: projectConfig.dependencies.types.repo,
  // });
  // await buildProject(projectConfig.dependencies['http-client'].path);

  // console.info('Building Redux state...');
  // await buildReduxSlices({
  //   httpClientProjectName: projectConfig.dependencies['http-client'].repo,
  //   projectPath: projectConfig.dependencies['redux-state'].path,
  //   typesProjectName: projectConfig.dependencies.types.repo,
  // });
  // await buildProject(projectConfig.dependencies['redux-state'].path);
}
