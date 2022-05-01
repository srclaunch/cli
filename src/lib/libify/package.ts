import { Project } from '@srclaunch/types';
import {
  PROJECT_PACKAGE_JSON_BUILD_SCRIPTS,
  PROJECT_PACKAGE_JSON_ENGINES,
  PROJECT_PACKAGE_JSON_EXPORTS,
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_LICENSE,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_PUBLISH_CONFIG,
  PROJECT_PACKAGE_JSON_TEST_SCRIPTS,
  PROJECT_PACKAGE_JSON_TYPE,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../../constants/project';

export function constructPackageJson({
  author,
  dependencies = {},
  description,
  devDependencies = {},
  engines = PROJECT_PACKAGE_JSON_ENGINES,
  exports = PROJECT_PACKAGE_JSON_EXPORTS,
  files = PROJECT_PACKAGE_JSON_FILES,
  license = PROJECT_PACKAGE_JSON_LICENSE,
  main = PROJECT_PACKAGE_JSON_MAIN,
  module = PROJECT_PACKAGE_JSON_MODULE,
  name,
  peerDependencies = {},
  publishConfig = PROJECT_PACKAGE_JSON_PUBLISH_CONFIG,
  scripts,
  type = PROJECT_PACKAGE_JSON_TYPE,
  types = PROJECT_PACKAGE_JSON_TYPES,
  version,
}: {
  author?: string;
  build?: boolean;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  exports?:
    | {
        [x: string]: {
          import: string | undefined;
          require: string | undefined;
        };
      }
    | undefined;
  files?: string[];
  license?: string;
  main?: string;
  module?: string;
  name: string;
  peerDependencies?: Record<string, string>;
  publishConfig?: Record<string, string>;
  scripts?: Record<string, string>;
  test?: boolean;
  type?: 'module' | 'commonjs' | 'amd' | 'umd';
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

export function getPackageScripts({
  build = true,
  run,
  test = true,
}: {
  build?: boolean;
  run?: Project['run'];
  test?: boolean;
}): Record<string, string> {
  let scripts = {};

  if (build) {
    scripts = { ...scripts, PROJECT_PACKAGE_JSON_BUILD_SCRIPTS };
  }

  if (test) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_TEST_SCRIPTS,
    };
  }

  if (run && run.development) {
    scripts = {
      ...scripts,
      dev: run.development,
    };
  }

  if (run && run.qa) {
    scripts = {
      ...scripts,
      qa: run.qa,
    };
  }

  if (run && run.preview) {
    scripts = {
      ...scripts,
      preview: run.preview,
    };
  }

  return scripts;
}
