import {
  PROJECT_PACKAGE_JSON_ENGINES,
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_LICENSE,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_PUBLISH_CONFIG,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../../constants/project';

export function getPackageJson({
  author,
  dependencies = {},
  description,
  devDependencies = {},
  engines = PROJECT_PACKAGE_JSON_ENGINES,
  exports = {
    '.': { import: './dist/index.mjs', require: './dist/index.umd.cjs' },
  },
  files = PROJECT_PACKAGE_JSON_FILES,
  license = PROJECT_PACKAGE_JSON_LICENSE,
  main = PROJECT_PACKAGE_JSON_MAIN,
  module = PROJECT_PACKAGE_JSON_MODULE,
  name,
  peerDependencies = {},
  publishConfig = PROJECT_PACKAGE_JSON_PUBLISH_CONFIG,
  scripts,
  type,
  types = PROJECT_PACKAGE_JSON_TYPES,
  version,
}: {
  author?: string;
  build?: boolean;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  exports?: {
    '.': { import: string; require: string };
  };
  files?: string[];
  license?: string;
  main?: string;
  module?: string;
  name: string;
  peerDependencies?: Record<string, string>;
  publishConfig?: Record<string, string>;
  scripts?: Record<string, string>;
  test?: boolean;
  type: 'module' | 'commonjs' | 'amd' | 'umd';
  types?: string;
  version?: string;
}) {
  return {
    name,
    description,
    author,
    license,
    version,
    engines,
    publishConfig,
    type,
    main,
    types,
    files,
    module,
    exports,
    scripts,
    dependencies,
    devDependencies,
    peerDependencies,
  };
}
