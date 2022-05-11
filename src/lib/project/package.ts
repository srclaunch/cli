import { PackageOptions, PackageType, Project } from '@srclaunch/types';
import {
  PROJECT_PACKAGE_JSON_BUILD_SCRIPTS,
  PROJECT_PACKAGE_JSON_COMMON_SCRIPTS,
  PROJECT_PACKAGE_JSON_DEV_SCRIPTS,
  PROJECT_PACKAGE_JSON_ENGINES,
  PROJECT_PACKAGE_JSON_EXPORTS,
  PROJECT_PACKAGE_JSON_FILES,
  PROJECT_PACKAGE_JSON_LICENSE,
  PROJECT_PACKAGE_JSON_MAIN,
  PROJECT_PACKAGE_JSON_MODULE,
  PROJECT_PACKAGE_JSON_PREVIEW_SCRIPTS,
  PROJECT_PACKAGE_JSON_PRODUCTION_SCRIPTS,
  PROJECT_PACKAGE_JSON_PUBLISH_CONFIG,
  PROJECT_PACKAGE_JSON_QA_SCRIPTS,
  PROJECT_PACKAGE_JSON_RELEASE_SCRIPTS,
  PROJECT_PACKAGE_JSON_TEST_SCRIPTS,
  PROJECT_PACKAGE_JSON_TYPE,
  PROJECT_PACKAGE_JSON_TYPES,
} from '../../constants/project';

export function constructPackageJson({}) {}

export function getPackageScripts({
  build = true,
  release = true,
  run,
  test = true,
}: {
  build?: boolean;
  release?: boolean;
  run?: Project['run'];
  test?: boolean;
}): Record<string, string> {
  let scripts = {
    ...PROJECT_PACKAGE_JSON_COMMON_SCRIPTS,
  };

  if (build) {
    scripts = { ...scripts, ...PROJECT_PACKAGE_JSON_BUILD_SCRIPTS };
  }

  if (test) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_TEST_SCRIPTS,
    };
  }

  if (release) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_RELEASE_SCRIPTS,
    };
  }

  if (run && run.development) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_DEV_SCRIPTS,
    };
  }

  if (run && run.qa) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_QA_SCRIPTS,
    };
  }

  if (run && run.preview) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_PREVIEW_SCRIPTS,
    };
  }

  if (run && run.production) {
    scripts = {
      ...scripts,
      ...PROJECT_PACKAGE_JSON_PRODUCTION_SCRIPTS,
    };
  }

  return scripts;
}
