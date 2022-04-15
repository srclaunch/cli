import fs from 'fs-extra';
import path from 'node:path';

export async function cleanModels() {
  try {
    const MODEL_DEPS_PATH = path.join(path.resolve(), 'dependencies/models');

    await fs.emptyDir(path.join(MODEL_DEPS_PATH, 'src'));

    // const TYPES_DEPS_PATH = path.join(
    //   path.resolve(),
    //   APPLAB_DIRECTORY,
    //   'dependencies/types',
    // );
    // const SEQUELIZE_DEPS_PATH = path.join(
    //   path.resolve(),
    //   APPLAB_DIRECTORY,
    //   'dependencies/sequelize-models',
    // );

    // await fs.emptyDir(path.join(MODEL_DEPS_PATH, 'src', 'applab'));
    // await fs.emptyDir(path.join(MODEL_DEPS_PATH, 'src', 'json'));
    // await fs.emptyDir(path.join(TYPES_DEPS_PATH, 'src'));
    // await fs.emptyDir(path.join(SEQUELIZE_DEPS_PATH, 'src'));
  } catch (error: any) {
    console.error(error);
  }
}
