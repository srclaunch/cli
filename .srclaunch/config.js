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
        'c8',
        'esbuild',
        'esbuild-css-modules-plugin',
        'fs-extra',
        'ink',
        'jest-cli', // 'jest-pnp-resolver',
        'meow',
        'simple-git',
        'standard-version',
        'typescript',
        'update-notifier',
        'vite',
        '@vitejs/plugin-react',
      ],
    },
    formats: [BuildFormat.ESM, BuildFormat.CJS],
    platform: BuildPlatform.Node,
    sourcemap: true,
    splitting: false,
    target: BuildTarget.ESNext,
    tool: BuildTool.ESBuild,
  },
};
