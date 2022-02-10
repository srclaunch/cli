import base from '@srclaunch/dx/.eslintrc.ui';

module.exports = {
  ...base,
  parserOptions: {
    ...base.parserOptions,
    project: './tsconfig.json',
  },
};
