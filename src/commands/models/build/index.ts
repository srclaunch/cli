import path from 'path';
import fs from 'fs-extra';

import { cleanModels } from './clean.js';
import { copyStubModels } from './stubs/index.js';
import { buildAppLabModels } from './outputs/applab.js';
import { buildSequelizeModels } from './outputs/sequelize.js';
import { buildJSONModels } from './outputs/json.js';
import { buildReduxSlices } from './outputs/redux.js';
import { buildModelTypes } from './outputs/types.js';
import { buildHttpClient } from './outputs/http-client.js';
import { build } from '../../../lib/build/index.js';

export async function buildModels() {
  const config = await JSON.parse(await fs.readFile(path.join(path.resolve(), path.join('./.applab/config.json')), 'utf8'));
  console.log('config',config);
  await cleanModels();
  await copyStubModels();
  
  await buildAppLabModels({ path: config.dependencies.models.path });
  await build({
    buildPath: `.applab/${config.dependencies.models.path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });
  

  await buildModelTypes({ path: config.dependencies.types.path });
  await build({
    buildPath: `.applab/${config.dependencies.types.path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });

  await buildSequelizeModels({ path: config.dependencies['sequelize-models'].path });
  await build({
    buildPath: `.applab/${config.dependencies['sequelize-models'].path}`,
    buildTypes: true,
    bundle: true,
    excludeLibs: ['sequelize'],
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'node',
  });

  await buildHttpClient({ httpClientProjectName: config.dependencies['http-client'].repo, path: config.dependencies['http-client'].path, modelsPath: config.dependencies.models.path, typesProjectName: config.dependencies.types.repo });
  await build({
    buildPath: `.applab/${config.dependencies['http-client'].path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });

  await buildReduxSlices({
    httpClientProjectName: config.dependencies['http-client'].repo,
    projectPath: config.dependencies['redux-state'].path,
    typesProjectName: config.dependencies['types'].repo,
  });
  await build({
    buildPath: `.applab/${config.dependencies['redux-state'].path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });


}
