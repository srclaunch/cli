import {
  BuildFormat,
  BuildPlatform,
  BuildTarget,
  BuildTool,
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
        'esbuild-css-modules-plugin',
        'fs-extra',
        'ink',
        'jest-cli', // 'jest-pnp-resolver',
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
};
