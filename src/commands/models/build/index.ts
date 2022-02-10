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
  
  await buildAppLabModels({ path: config.models.path });
  await build({
    buildPath: `.applab/${config.models.path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });
  

  await buildModelTypes({ path: config.types.path });
  await build({
    buildPath: `.applab/${config.types.path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });

  await buildSequelizeModels({ path: config['sequelize-models'].path });
  await build({
    buildPath: `.applab/${config['sequelize-models'].path}`,
    buildTypes: true,
    bundle: true,
    excludeLibs: ['sequelize'],
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'node',
  });

  await buildHttpClient({ path: config['http-client'].path });
  await build({
    buildPath: `.applab/${config['http-client'].path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });

  await buildReduxSlices({
    httpClientProjectName: config['http-client'].repo,
    projectPath: config['redux-state'].path,
    typesProjectName: config['types'].repo,
  });
  await build({
    buildPath: `.applab/${config['redux-state'].path}`,
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });


}
