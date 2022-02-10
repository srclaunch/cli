
export function constructModelExportIndexScript(
  models: string[],
  modelFormat: 'sequelize' | 'applab' | 'json' | 'ts' = 'applab',
): string | void {
  try {
    let indexFileExports = '';
    let indexFileImports = '';
    let sequelizeDefaultExports = 'export default {';

    const fileExtension = `.${
      modelFormat === 'applab' || modelFormat === 'sequelize' ? 'ts' : 'json'
    }`;

    for (const model of models) {
      const modelName = model.split(fileExtension)[0];

      if (modelFormat === 'json') {
        indexFileImports += `import ${modelName} from './${modelName}.json';\n`;
      } else if (modelFormat === 'sequelize') {
        indexFileImports += `import ${modelName}Init, { ${modelName} } from './${modelName}';\n`;
        sequelizeDefaultExports += `${modelName}: ${modelName}Init,`;
      } else {
        indexFileImports += `import { ${modelName} } from './${modelName}.js';\n`;
      }

      indexFileExports += `  ${modelName},\n`;
    }

    if (modelFormat === 'sequelize') {
      sequelizeDefaultExports += '};';
    }

    return `${indexFileImports}\nexport {\n${indexFileExports}};\n${
      modelFormat === 'sequelize' ? sequelizeDefaultExports : ''
    }\n`;
  } catch (err: any) {
    console.error(err);
  }
}

export async function constructAppLabModelExports() {
  return `import { Model } from '@srclaunch/types';
export * from "./applab/index";

import * as Models from "./applab/index";

export function getModels(): Record<string, Model> {
  return Models as Record<string, Model>;
}`;
}
