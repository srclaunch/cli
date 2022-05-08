import Yaml from 'js-yaml';
import {
  BuildFormat,
  BuildPlatform,
  BuildTarget,
  BuildTool,
  CodeFormatterTool,
  CodeLinterTool,
  Project,
  ProjectType,
  SrcLaunchConfig,
  StaticTypingTool,
  TestReporter,
  TestTool,
} from '@srclaunch/types';
import { loadConfig } from 'unconfig';
import { readFile, writeFile } from './file-system';

export type SrcLaunchConfigFile = {
  name: '.srclaunchrc' | 'srclaunch.config';
  extension?:
    | 'ts'
    | 'mts'
    | 'cts'
    | 'js'
    | 'mjs'
    | 'cjs'
    | 'json'
    | 'yaml'
    | 'yml';
};

const CONFIG_FILE_NAMES = ['.srclaunchrc', 'srclaunch.config'];

export function getDefaultSrcLaunchProjectConfig(): Omit<
  Project,
  'name' | 'type'
> {
  return {
    build: {
      input: {
        directory: 'src',
        file: 'index.ts',
      },
      formats: [BuildFormat.ESM, BuildFormat.UMD],
      platform: BuildPlatform.Browser,
      target: BuildTarget.ESNext,
      tool: BuildTool.Vite,
    },
    environments: {
      development: {
        formatters: [CodeFormatterTool.Prettier],
        linters: [CodeLinterTool.ESLint],
        staticTyping: [StaticTypingTool.TypeScript],
      },
    },
    test: {
      coverage: {
        reporters: [TestReporter.Lcov, TestReporter.JSONSummary],
      },
      tool: TestTool.Jest,
    },
    requirements: {
      node: '>=16',
      yarn: '>=3.2.0',
      srclaunch: {
        dx: true,
        cli: true,
        types: true,
      },
    },
  };
}

export async function createSrcLaunchProjectConfig({
  file = {
    name: '.srclaunchrc',
    extension: 'ts',
  },
  ...project
}: Project & {
  file?: SrcLaunchConfigFile;
}): Promise<void> {
  switch (file.extension) {
    case 'ts':
    case 'mts':
    case 'cts':
      await writeSrcLaunchConfig({
        config: constructSrcLaunchProjectTSConfig(project),
      });
    case 'js':
    case 'mjs':
    case 'cjs':
    case 'json':
    case 'yaml':
    case 'yml':
  }
}

export function constructSrcLaunchProjectTSConfig(config?: Project): string {
  return `import {
    BuildFormat,
    BuildPlatform,
    BuildTarget,
    BuildTool,
    CodeFormatterTool,
    CodeLinterTool,
    Project,
    ProjectType,
    SrcLaunchConfig,
    StaticTypingTool,
    TestReporter,
    TestTool,
  } from '@srclaunch/types';

const config: Project = {
  name: '${config?.name}',
  description: '${config?.description}',
  build: {
    input: {
      directory: 'src',
      file: 'index.ts',
    },
    formats: [BuildFormat.ESM, BuildFormat.UMD],
    platform: BuildPlatform.Browser,
    target: BuildTarget.ESNext,
    tool: BuildTool.Vite,
  },
  environments: {
    development: {
      formatters: [CodeFormatterTool.Prettier],
      linters: [CodeLinterTool.ESLint],
      staticTyping: [StaticTypingTool.TypeScript],
    },
  },
  test: {
    coverage: {
      reporters: [TestReporter.Lcov, TestReporter.JSONSummary],
    },
    tool: TestTool.Jest,
  },
  requirements: {
    node: '>=16',
    yarn: '>=3.2.0',
    srclaunch: {
      dx: true,
      cli: true,
      types: true,
    },
  },
};

export default config;`;
}

export async function constructSrcLaunchJSConfig({
  name,
  description,
  type,
}: Project): Promise<string> {
  return '';
}

export async function constructSrcLaunchJSONConfig({
  name,
  description,
  type,
}: Project): Promise<string> {
  return '';
}

export async function constructSrcLaunchYAMLConfig({
  name,
  description,
  type,
}: Project): Promise<string> {
  return '';
}

export async function getSrcLaunchConfig(): Promise<SrcLaunchConfig> {
  const { config, sources } = await loadConfig<SrcLaunchConfig>({
    sources: [
      {
        files: CONFIG_FILE_NAMES,
        // default extensions
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
      {
        files: CONFIG_FILE_NAMES,
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

  return config;
}

export function isValidSrcLaunchConfig(
  config?: SrcLaunchConfig & { type?: ProjectType | undefined },
): boolean {
  if (!config) {
    return false;
  }

  if (!config.name || !config.description || !config.type) {
    return false;
  }

  // TODO: Add more checks here

  return true;
}

export async function writeSrcLaunchConfig({
  config,
  file = { name: '.srclaunchrc', extension: 'ts' },
}: {
  config: string;
  file?: SrcLaunchConfigFile;
}): Promise<void> {
  await writeFile(`${file.name}.${file.extension}`, config);
}
