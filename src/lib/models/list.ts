import fs from 'fs-extra';
import path from 'path';

export async function listModels() {
  const modelsPath = path.join('models');

  const files = fs.readdirSync(modelsPath).filter(file => {
    return file.slice(-3) === '.ts' && file.split('.ts')[0] !== 'index';
  });

  console.info(files.map(file => file.split('.ts')[0]).toString());
}
