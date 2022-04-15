const base = require('./.eslintrc.cjs');

module.exports = {
  ...base,
  env: {
    ...base.env,
    browser: true,
    webextensions: true,
  },
  extends: [
    ...base.extends,
    'plugin:@microsoft/sdl/react', // Microsoft SDL React rules
    'plugin:jsx-a11y/recommended',
    'plugin:better-styled-components/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
  ],
  plugins: [
    ...base.plugins,
    'better-styled-components',
    'jsx-a11y',
    'react',
    'react-hooks',
  ],
  rules: {
    ...base.rules,
    'react-hooks/exhaustive-deps': [
      'warn',
      { additionalHooks: '^(useCallbackDelay|useCommands|useStateAsync)$' },
    ],
    'react/display-name': 'off',
    'react/jsx-boolean-value': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-brace-presence': [
      'warn',
      { children: 'never', props: 'never' },
    ],
    'react/jsx-uses-react': 'off',
    'react/jsx-wrap-multilines': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'react/sort-prop-types': [
      'error',
      {
        callbacksLast: false,
        ignoreCase: true,
        noSortAlphabetically: false,
        requiredFirst: true,
        sortShapeProp: true,
      },
    ],
    'testing-library/prefer-screen-queries': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
