import path from 'path';
import fs from 'fs-extra';
import { build } from '../../lib/build/index.js';
import { BuildConfig } from '../../types/build/index';

export async function handleBuildCommand(config: BuildConfig | BuildConfig[]) {
  if (Array.isArray(config)) {
    let buildDirs: (string | undefined)[] = [];
    for (const buildConfig of config) {
      if (!buildDirs.includes(buildConfig.buildDir)) {
        if (buildConfig.emptyBuildDir) {
          await fs.emptyDir(path.join(path.resolve(), buildConfig.buildDir ?? 'dist'));
        }
        buildDirs = [...buildDirs, buildConfig.buildDir];
      }

      await build(buildConfig);
    }
  } else {
    if (config.emptyBuildDir) {
      await fs.emptyDir(path.join(path.resolve(), config.buildDir ?? 'dist'));
    }

    await build(config);
  }
}
