import {
  createDirectory,
  deleteDirectory,
  deleteFile,
  fileExists,
  readFile,
  writeFile,
} from './file-system';
import path from 'node:path';
import ts from 'typescript';
import Yaml from 'js-yaml';
import { SrcLaunchConfig } from '@srclaunch/types';
import { CustomParser, loadConfig } from 'unconfig';

export async function getSrcLaunchConfig(): Promise<SrcLaunchConfig> {
  const names = ['.srclaunch', '.srclaunchrc', 'srclaunch', 'srclaunch.config'];
  const { config, sources } = await loadConfig<SrcLaunchConfig>({
    sources: [
      {
        files: names,
        // default extensions
        extensions: [
          'ts',
          'mts',
          'cts',
          'js',
          'mjs',
          'cjs',
          'json',
          'yml',
          'yaml',
          '',
        ],
      },
      {
        files: names,
        extensions: ['yml', 'yaml'],
        parser: async path => {
          const content = await readFile(path);
          return Yaml.load(content.toString());
        },
      },
      {
        files: 'package.json',
        extensions: [],
        rewrite(cfg: { srclaunch?: SrcLaunchConfig }) {
          return cfg?.srclaunch;
        },
      },
      {
        files: 'vite.config',
        async rewrite(
          cfg:
            | { srclaunch?: SrcLaunchConfig }
            | (() => Promise<
                Record<string, unknown> & { srclaunch?: SrcLaunchConfig }
              >),
        ) {
          const viteConfig = await (typeof cfg === 'function' ? cfg() : cfg);
          return viteConfig?.srclaunch;
        },
      },
    ],
    // if false, the only the first matched will be loaded
    // if true, all matched will be loaded and deep merged
    merge: false,
  });

  console.info('Loaded config from ' + sources.join(', '));

  return config;
}
