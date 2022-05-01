// const base = require('@srclaunch/dx/.eslintrc');

// module.exports = {
//   ...base,
// };

// .eslintrc.cjs
export const ESLINT_CONFIG_CONTENT = `module.exports = {
  "extends": [
    "@srclaunch/dx/.eslintrc",
  ],
};`;

// .eslintrc.cjs
export const ESLINT_UI_CONFIG_CONTENT = `module.exports = {
  "extends": [
    "@srclaunch/dx/.eslintrc.ui",
  ],
};`;

// .prettierrc.cjs
export const PRETTIER_CONFIG_CONTENT = `const base = require('@srclaunch/dx/.prettierrc');

module.exports = {
  ...base,
};
`;

// .stylelintrc.js
export const STYLELINT_CONFIG_CONTENT = `import base from '@srclaunch/dx/.stylelintrc';

export default {
  ...base
};`;

// .stylelintrc.js
export const STYLELINT_UI_CONFIG_CONTENT = `import base from '@srclaunch/dx/.stylelintrc.ui';

export default {
  ...base
};`;

// tsconfig.json
export const TYPESCRIPT_CONFIG_CONTENT = `{
  "extends": "@srclaunch/dx/tsconfig.json",
  "include": ["src"]
}`;

// tsconfig.json
export const TYPESCRIPT_UI_CONFIG_CONTENT = `{
  "extends": "@srclaunch/dx/tsconfig.ui.json",
  "include": ["src"]
}`;
