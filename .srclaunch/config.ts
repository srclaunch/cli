import {
  BuildFormat,
  BuildPlatform,
  BuildTool,
  Project,
  ProjectType,
} from '@srclaunch/types';

export default {
  name: '@srclaunch/cli',
  description: 'CLI tools for working with SrcLaunch projects and workspaces.',
  type: ProjectType.CLIApplication,
  build: {
    bundle: {
      exclude: [
        '@vitejs/plugin-react-refresh',
        'fs-extra',
        'fsevents',
        'esbuild',
        'esbuild-css-modules-plugin',
        'meow',
        'typescript',
        'update-notifier',
      ],
    },
    format: BuildFormat.ESM,
    platform: BuildPlatform.Node,
    sourcemap: true,
    tool: BuildTool.ESBuild,
  },
} as Project;
