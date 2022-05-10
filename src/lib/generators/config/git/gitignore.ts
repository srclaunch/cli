export function generateGitIgnoreConfig(ignorePaths: string[] = []) {
  const defaultPaths = [
    '.env',
    '.DS_Store',
    'node_modules',
    'dist',
    '.yarn/*',
    '!.yarn/cache',
    '!.yarn/patches',
    '!.yarn/plugins',
    '!.yarn/releases',
    '!.yarn/sdks',
    '!.yarn/versions',
  ];

  return [...defaultPaths, ...ignorePaths].join('\n');
}
