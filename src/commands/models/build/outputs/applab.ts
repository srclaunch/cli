import fs from 'fs-extra';
import path from 'node:path';

import { constructModelExportIndexScript } from '../exports';

export async function buildAppLabModels(projectPath: string): Promise<void> {
  try {
    const MODELS_PATH = path.join(path.resolve(), 'models');
    const BUILD_PATH = path.join(path.resolve(), `${projectPath}/src`);

    await fs.emptyDir(BUILD_PATH);

    const files = await fs.readdir(MODELS_PATH);

    for (const file of files) {
      const fileContents = await fs.readFile(
        path.join(MODELS_PATH, file),
        'utf8',
      );

      const fieldsPropertyExists = fileContents.includes('fields: {');

      if (!fieldsPropertyExists) {
        throw new Error(`${file} is missing the fields property.`);
      }

      let entityFields = `
    created_date: {
      label: 'Created Date',
      required: false,
      type: Primitives.DateTime,
    },
    updated_date: {
      label: 'Updated Date',
      required: false,
      type: Primitives.DateTime,
    },
  `;

      const relationshipsStart = fileContents.indexOf('relationships:') + 15;
      const relationshipsEnd =
        fileContents.indexOf('}', relationshipsStart) + 1;
      const relationships = fileContents.slice(
        relationshipsStart,
        relationshipsEnd,
      );

      if (relationships) {
        const belongsToStart = relationships.indexOf('belongsTo:') + 10;
        const belongsToEnd = relationships.indexOf(']', belongsToStart) + 1;
        const belongsTo = relationships.slice(belongsToStart, belongsToEnd);

        if (belongsTo) {
          const transformed = belongsTo
            .replace(/'/g, '"')
            .replace(/ {2}|\r\n|\n|\r/g, '')
            .replace(/\s/g, '')
            .replace(',]', ']');

          const belongsToFields = JSON.parse(transformed);

          for (const relationship of belongsToFields) {
            entityFields += `
        ${relationship}Id: {
          label: '${relationship}',
          required: false,
          type: Primitives.UUID
        },
        `;
          }
        }
      }

      const updatedFileContents = fileContents.replace(
        'fields: {',
        `fields: {
        ${entityFields}`,
      );

      // logger.info(`Writing ${file} model`);

      await fs.writeFile(
        path.join(BUILD_PATH, file),
        updatedFileContents,
        'utf8',
      );
    }

    // logger.info(`Writing ${BUILD_PATH}/index.ts`);

    const buildModels = await fs.readdir(BUILD_PATH);
    const models = buildModels.filter(file => {
      return file.slice(-3) === '.ts' && file.split('.ts')[0] !== 'index';
    });

    const indexFileContent = constructModelExportIndexScript(models, 'applab');

    await fs.writeFile(
      path.join(BUILD_PATH, 'index.ts'),
      indexFileContent,
      'utf8',
    );
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}
