import path from 'path';
import fs from 'fs-extra';
import { Model } from '@srclaunch/types';
import { constructModelExportIndexScript } from '../exports.js';

export async function buildJSONModels({ path: projectPath }: { path: string }) {
  const APPLAB_DIRECTORY = '.applab';
  const MODELS_PATH = path.join(
    path.resolve(),
    APPLAB_DIRECTORY,
    `${projectPath}/src/applab`,
  );
  const BUILD_PATH = path.join(
    path.resolve(),
    APPLAB_DIRECTORY,
    `${projectPath}/dist/json`,
  );

  await fs.emptyDir(BUILD_PATH);

  console.info('Writing JSON models');

  const files = await fs.readdir(MODELS_PATH);

  const filteredFiles = files.filter(
    file =>
      file.indexOf('index.js') === -1 &&
      file.indexOf('.ts') === -1 &&
      file.indexOf('.map') === -1,
  );

  const models = await Promise.all(
    filteredFiles.map(async file => {
      const model = await import(`${MODELS_PATH}/${file}`);
      return model[file.replace('.js', '')];
    }),
  );

  for (const [key, model] of [...Object.entries(models as Model[])]) {
    const modelName = model.name;

    console.info(`Writing ${modelName}.json JSON model`);
    const serializedModel = JSON.stringify(model, null, 2);

    const fileName = `${modelName}.json`;
    const filePath = path.join(BUILD_PATH, fileName);

    await fs.writeFile(filePath, serializedModel, 'utf8');
  }

  const indexFileContent = constructModelExportIndexScript(
    Object.keys(models).map(modelName => modelName),
    'json',
  );

  console.info(`Writing ${BUILD_PATH}/index.ts`);

  await fs.writeFile(
    path.join(BUILD_PATH, 'index.ts'),
    indexFileContent,
    'utf8',
  );

  console.info('Finished building JSON models');
}
