import { BrowserPackage, Package, Project } from '@srclaunch/types';
import {
  JS_FILE_DOWNLOAD_DEPENDENCIES,
  REACT_COLORFUL_DEPENDENCIES,
  REACT_COUNTRY_FLAG_DEPENDENCIES,
  REACT_DATE_PICKER_DEPENDENCIES,
  REACT_DEPENDENCIES,
  REACT_DOM_DEPENDENCIES,
  REACT_DROPZONE_DEPENDENCIES,
  REACT_HOOKS_DEPENDENCIES,
  REACT_REDUX_DEPENDENCIES,
  REACT_ROUTER_DEPENDENCIES,
  REACT_SYNTAX_HIGHLIGHTER_DEPENDENCIES,
  STYLED_COMPONENTS_DEPENDENCIES,
  WEB_APPLICATION_STATE_DEPENDENCIES,
  WEB_ENVIRONMENT_DEPENDENCIES,
} from '../../constants/dependencies';
import {
  AVA_TESTING_DEV_DEPENDENCIES,
  COMMON_DEV_DEPENDENCIES,
  ESLINT_DEV_DEPENDENCIES,
  GITHUB_DEV_DEPENDENCIES,
  JEST_REACT_TESTING_DEV_DEPENDENCIES,
  JEST_TESTING_DEV_DEPENDENCIES,
  PRETTIER_DEV_DEPENDENCIES,
  REACT_DEV_DEPENDENCIES,
  REACT_ROUTER_DEV_DEPENDENCIES,
  RELEASE_DEV_DEPENDENCIES,
  SRCLAUNCH_DEV_DEPENDENCIES,
  STYLED_COMPONENTS_DEV_DEPENDENCIES,
  STYLELINT_DEV_DEPEENDENCIES,
  TEST_COVERAGE_DEV_DEPENDENCIES,
  TYPESCRIPT_DEV_DEPENDENCIES,
} from '../../constants/dev-dependencies';

export function getPackageDependencies(package_: Package) {
  switch (package_) {
    case BrowserPackage.Environment:
      return WEB_ENVIRONMENT_DEPENDENCIES;
    case BrowserPackage.JSFileDownload:
      return JS_FILE_DOWNLOAD_DEPENDENCIES;
    case BrowserPackage.React:
      return REACT_DEPENDENCIES;
    case BrowserPackage.ReactColorful:
      return REACT_COLORFUL_DEPENDENCIES;
    case BrowserPackage.ReactCountryFlag:
      return REACT_COUNTRY_FLAG_DEPENDENCIES;
    case BrowserPackage.ReactDOM:
      return REACT_DOM_DEPENDENCIES;
    case BrowserPackage.ReactDatePicker:
      return REACT_DATE_PICKER_DEPENDENCIES;
    case BrowserPackage.ReactDropzone:
      return REACT_DROPZONE_DEPENDENCIES;
    case BrowserPackage.ReactHooks:
      return REACT_HOOKS_DEPENDENCIES;
    case BrowserPackage.ReactSyntaxHighlighter:
      return REACT_SYNTAX_HIGHLIGHTER_DEPENDENCIES;
    case BrowserPackage.ReactRedux:
      return REACT_REDUX_DEPENDENCIES;
    case BrowserPackage.ReactRouter:
      return REACT_ROUTER_DEPENDENCIES;
    case BrowserPackage.StyledComponents:
      return STYLED_COMPONENTS_DEPENDENCIES;
    case BrowserPackage.Themes:
      return STYLED_COMPONENTS_DEPENDENCIES;
    case BrowserPackage.WebApplicationState:
      return WEB_APPLICATION_STATE_DEPENDENCIES;
    default:
      return;
  }
}

export function getDependencies(packages?: Package[]) {
  console.log('packages', packages);
  if (!packages) {
    return undefined;
  }

  let dependencies: { [key: string]: string } = {};

  for (const package_ of packages) {
    dependencies = {
      ...dependencies,
      ...getPackageDependencies(package_),
    };
  }

  return dependencies;
}

export function getDevDependencies({
  ava,
  eslint = true,
  github,
  jest,
  jestReact,
  prettier = true,
  react,
  reactRouter,
  release = true,
  srclaunch = true,
  styledComponents,
  stylelint = true,
  testCoverage,
  typescript = true,
}: {
  ava?: boolean;
  eslint?: boolean;
  github?: boolean;
  jest?: boolean;
  jestReact?: boolean;
  prettier?: boolean;
  react?: boolean;
  reactRouter?: boolean;
  release?: boolean;
  srclaunch?: boolean;
  styledComponents?: boolean;
  stylelint?: boolean;
  testCoverage?: boolean;
  typescript?: boolean;
}): Record<string, string> {
  let dependencies = {
    ...COMMON_DEV_DEPENDENCIES,
  };

  if (ava) {
    dependencies = {
      ...dependencies,
      ...AVA_TESTING_DEV_DEPENDENCIES,
    };
  }

  if (eslint) {
    dependencies = {
      ...dependencies,
      ...ESLINT_DEV_DEPENDENCIES,
    };
  }

  if (github) {
    dependencies = {
      ...dependencies,
      ...GITHUB_DEV_DEPENDENCIES,
    };
  }

  if (jest) {
    dependencies = {
      ...dependencies,
      ...JEST_TESTING_DEV_DEPENDENCIES,
    };
  }

  if (jestReact) {
    dependencies = {
      ...dependencies,
      ...JEST_REACT_TESTING_DEV_DEPENDENCIES,
    };
  }

  if (prettier) {
    dependencies = {
      ...dependencies,
      ...PRETTIER_DEV_DEPENDENCIES,
    };
  }

  if (react) {
    dependencies = {
      ...dependencies,
      ...REACT_DEV_DEPENDENCIES,
    };
  }

  if (reactRouter) {
    dependencies = {
      ...dependencies,
      ...REACT_ROUTER_DEV_DEPENDENCIES,
    };
  }

  if (release) {
    dependencies = {
      ...dependencies,
      ...RELEASE_DEV_DEPENDENCIES,
    };
  }

  if (srclaunch) {
    dependencies = {
      ...dependencies,
      ...SRCLAUNCH_DEV_DEPENDENCIES,
    };
  }

  if (styledComponents) {
    dependencies = {
      ...dependencies,
      ...STYLED_COMPONENTS_DEV_DEPENDENCIES,
    };
  }

  if (stylelint) {
    dependencies = {
      ...dependencies,
      ...STYLELINT_DEV_DEPEENDENCIES,
    };
  }

  if (testCoverage) {
    dependencies = {
      ...dependencies,
      ...TEST_COVERAGE_DEV_DEPENDENCIES,
    };
  }

  if (typescript) {
    dependencies = {
      ...dependencies,
      ...TYPESCRIPT_DEV_DEPENDENCIES,
    };
  }

  return dependencies;
}
