import fs from 'fs-extra';
import path from 'node:path';

import { build } from '../../lib/build/index';
import { BuildConfig } from '../../types/build/index';

export async function handleBuildCommand(
  config: BuildConfig | readonly BuildConfig[],
) {
  if (Array.isArray(config) && config.length > 0) {
    let buildDirs: (string | undefined)[] = [];

    for (const buildConfig of config) {
      if (!buildDirs.includes(buildConfig.buildDir)) {
        await fs.emptyDir(
          path.join(path.resolve(), buildConfig.buildDir ?? 'dist'),
        );

        buildDirs = [...buildDirs, buildConfig.buildDir];
      }

      await build(buildConfig);
    }
  }
}
