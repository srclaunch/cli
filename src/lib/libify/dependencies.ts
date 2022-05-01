import { Project } from '@srclaunch/types';
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
} from '../../constants/project';
export function getProjectDependencies(config: Project) {}

export function getProjectPeerDependencies(config: Project) {}

export function getProjectDevDependencies({
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
