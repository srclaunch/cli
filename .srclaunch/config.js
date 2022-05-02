import {
  BuildFormat,
  BuildPlatform,
  BuildTarget,
  BuildTool,
  License,
  PackageAccess,
  ProjectType,
} from '@srclaunch/types';

export default {
  name: '@srclaunch/cli',
  description: 'CLI tools for working with SrcLaunch projects and workspaces.',
  type: ProjectType.CLIApplication,
  build: {
    bundle: {
      exclude: [
        '@rauschma/stringio',
        'c8',
        'esbuild',
        'fs-extra',
        'ink',
        'jest-cli',
        'meow',
        'react',
        'simple-git',
        'standard-version',
        'typescript',
        'update-notifier',
        'vite',
        '@vitejs/plugin-react',
      ],
      globals: {
        react: 'React',
      },
    },
    formats: [BuildFormat.ESM, BuildFormat.UMD],
    platform: BuildPlatform.Node,
    target: BuildTarget.ESNext,
    tool: BuildTool.ESBuild,
  },
  release: {
    package: {
      publish: {
        access: PackageAccess.Public,
        license: License.MIT,
        registry: 'https://registry.npmjs.org/',
      },
    },
  },
};
