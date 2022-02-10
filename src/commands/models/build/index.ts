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
  await cleanModels();
  await copyStubModels();
  
  await buildAppLabModels({ path: 'dependencies/models' });
  await build({
    buildPath: '.applab/dependencies/models',
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });
  

  await buildModelTypes({ path: 'dependencies/types' });
  await build({
    buildPath: '.applab/dependencies/types',
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });

  await buildSequelizeModels({ path: 'dependencies/sequelize-models' });
  await build({
    buildPath: '.applab/dependencies/sequelize-models',
    buildTypes: true,
    bundle: true,
    excludeLibs: ['sequelize'],
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'node',
  });

  await buildHttpClient({ path: 'dependencies/http-client' });
  await build({
    buildPath: '.applab/dependencies/http-client',
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });

  await buildReduxSlices({
    httpClientProjectName: '@azorakapp/azorak-http-client',
    projectPath: 'dependencies/redux-state',
    typesProjectName: '@azorakapp/azorak-types',
  });
  await build({
    buildPath: '.applab/dependencies/redux-state',
    buildTypes: true,
    bundle: true,
    format: 'esm',
    inputScripts: ['src/index.ts'],
    platform: 'browser',
  });


}
