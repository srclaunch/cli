export const COMMON_DEV_DEPENDENCIES = {
  '@types/node': '^17.0.30',
};

export const SRCLAUNCH_DEV_DEPENDENCIES = {
  // The SrcLaunch CLI
  '@srclaunch/cli': '^0.1.346',
  // Developer Experience configuration and linters
  '@srclaunch/dx': '^0.1.52',
  // SrcLaunch type definitions
  '@srclaunch/types': '^0.1.117',
};

export const ESLINT_DEV_DEPENDENCIES = {
  '@microsoft/eslint-plugin-sdl': '^0.2.0',
  eslint: '^8.14.0',
  'eslint-config-prettier': '^8.5.0',
  'eslint-config-stylelint': '^15.0.0',
  'eslint-import-resolver-typescript': '^2.7.1',
  'eslint-plugin-eslint-comments': '^3.2.0',
  'eslint-plugin-functional': '^4.2.1',
  'eslint-plugin-import': '^2.26.0',
  'eslint-plugin-node': '^11.1.0',
  'eslint-plugin-only-warn': '^1.0.3',
  'eslint-plugin-prettier': '^4.0.0',
  'eslint-plugin-regexp': '^1.7.0',
  'eslint-plugin-simple-import-sort': '^7.0.0',
  'eslint-plugin-sort-keys-fix': '^1.1.2',
  'eslint-plugin-sort-requires': '^2.1.0',
  'eslint-plugin-unicorn': '^42.0.0',
};

export const PRETTIER_DEV_DEPENDENCIES = {
  prettier: '^2.6.2',
  // 'prettier-eslint': '^14.0.2',
};

export const STYLELINT_DEV_DEPEENDENCIES = {
  stylelint: '^14.8.1',
  'stylelint-config-idiomatic-order': '^8.1.0',
  'stylelint-config-prettier': '^9.0.3',
  'stylelint-config-recommended': '^7.0.0',
  'stylelint-config-styled-components': '^0.1.1',
  'stylelint-order': '^5.0.0',
};

export const GITHUB_DEV_DEPENDENCIES = {
  'eslint-plugin-github': '^4.3.6',
};

export const TYPESCRIPT_DEV_DEPENDENCIES = {
  '@typescript-eslint/eslint-plugin': '^5.21.0',
  '@typescript-eslint/parser': '^5.21.0',
  typescript: '^4.6.4',
};

export const AVA_TESTING_DEV_DEPENDENCIES = {
  ava: '^4.2.0',
};

export const TEST_COVERAGE_DEV_DEPENDENCIES = {
  c8: '^7.11.2',
};

export const RELEASE_DEV_DEPENDENCIES = {
  'standard-version': '^9.3.2',
};

export const REACT_DEV_DEPENDENCIES = {
  '@types/react': '^18.0.8',
  '@types/react-dom': '^18.0.3',
  '@types/react-is': '^17.0.3',
  'eslint-config-react-app': '^7.0.1',
  'eslint-plugin-jsx-a11y': '^6.5.1',
  'eslint-plugin-react': '^7.29.4',
  'eslint-plugin-react-hooks': '^4.5.0',
};

export const JEST_TESTING_DEV_DEPENDENCIES = {
  '@types/jest': '^27.4.1',
  'eslint-plugin-jest': '^26.1.5',
  'ts-jest': '^27.1.4',
};

export const JEST_REACT_TESTING_DEV_DEPENDENCIES = {
  ...JEST_TESTING_DEV_DEPENDENCIES,
  '@testing-library/jest-dom': '^5.16.4',
  '@testing-library/react': '^13.1.1',
  '@testing-library/user-event': '^14.1.1',
  'eslint-plugin-testing-library': '^5.3.1',
};

export const REACT_ROUTER_DEV_DEPENDENCIES = {
  '@types/react-router': '^5.1.18',
  '@types/react-router-dom': '^5.3.3',
};

export const STYLED_COMPONENTS_DEV_DEPENDENCIES = {
  '@types/styled-components': '^5.1.25',
  'eslint-plugin-better-styled-components': '^1.1.2',
};

export const PROJECT_PACKAGE_JSON_AUTHOR =
  'Steven Bennett <steven@srclaunch.com>';
export const PROJECT_PACKAGE_JSON_LICENSE = 'MIT';
export const PROJECT_PACKAGE_JSON_ENGINES = {
  node: '>=16',
};
export const PROJECT_PACKAGE_JSON_PUBLISH_CONFIG = {
  access: 'public',
  registry: 'https://registry.npmjs.org/',
};

export const PROJECT_PACKAGE_JSON_TYPE = 'module';
export const PROJECT_PACKAGE_JSON_MAIN = './dist/index.mjs';
export const PROJECT_PACKAGE_JSON_TYPES = './dist/index.d.ts';
export const PROJECT_PACKAGE_JSON_FILES = ['package.json', 'dist'];
export const PROJECT_PACKAGE_JSON_MODULE = './dist/index.mjs';
export const PROJECT_PACKAGE_JSON_EXPORTS = {
  '.': { import: './dist/index.mjs', require: './dist/index.umd.cjs' },
};
export const PROJECT_PACKAGE_JSON_BUILD_SCRIPTS = {
  build: 'yarn srclaunch build',
};
export const PROJECT_PACKAGE_JSON_RELEASE_SCRIPTS = {
  qr: 'yarn build && yarn srclaunch changesets add --message "Quick release" && yarn srclaunch release',
  release: 'yarn test:coverage && yarn srclaunch release',
};
export const PROJECT_PACKAGE_JSON_RUN_DEV_SCRIPTS = {
  dev: 'yarn srclaunch run dev',
};
export const PROJECT_PACKAGE_JSON_RUN_PREVIEW_SCRIPTS = {
  dev: 'yarn srclaunch run preview',
};
export const PROJECT_PACKAGE_JSON_RUN_QA_SCRIPTS = {
  dev: 'yarn srclaunch run qa',
};
export const PROJECT_PACKAGE_JSON_RUN_PRODUCTION_SCRIPTS = {
  dev: 'yarn srclaunch run production',
};
export const PROJECT_PACKAGE_JSON_TEST_SCRIPTS = {
  test: 'yarn srclaunch test',
  'test:watch': 'yarn srclaunch test --watch',
  'test:coverage': 'yarn srclaunch test --coverage',
};
export const PROJECT_PACKAGE_JSON_DEPENDENCY_SCRIPTS = {
  yui: 'yarn upgrade-interactive',
};
