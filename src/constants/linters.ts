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
