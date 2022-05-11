export function generateGitIgnoreConfig(ignorePaths: string[] = []) {
  const defaultPaths = [
    '.env',
    '.DS_Store',
    'coverage',
    'dist',
    'node_modules',
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
