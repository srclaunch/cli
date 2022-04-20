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
        'esbuild',
        'esbuild-css-modules-plugin',
        'fs-extra',
        'meow',
        'typescript',
        'update-notifier',
        'vite',
        '@vitejs/plugin-react',
      ],
    },
    format: BuildFormat.ESM,
    platform: BuildPlatform.Node,
    sourcemap: true,
    target: BuildTarget.ES2020,
    tool: BuildTool.ESBuild,
  },
};
