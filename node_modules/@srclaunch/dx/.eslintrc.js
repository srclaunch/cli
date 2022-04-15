export default {
  env: {
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@microsoft/sdl/common', // Microsoft SDL rules
    'plugin:@microsoft/sdl/typescript', // Microsoft SDL TS rules
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
    'plugin:stylelint',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: [
    '@microsoft/sdl',
    'functional',
    'unicorn',
    'prettier',
    'only-warn',
    'simple-import-sort',
    'sort-keys-fix',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        selector: 'default',
      },
      {
        format: ['camelCase', 'PascalCase', 'snake_case'],
        selector: 'property',
      },
      {
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        selector: 'variable',
      },
      { format: ['PascalCase'], selector: 'typeLike' },
      { format: ['PascalCase'], selector: 'enumMember' },
    ],
    '@typescript-eslint/no-shadow': ['error'],
    'functional/prefer-readonly-type': [
      'error',
      {
        allowLocalMutation: true,
        ignorePattern: '^mutable',
      },
    ],
    'lines-between-class-members': 0,
    'max-len': ['error', { code: 120 }],
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-console': 'warn',
    'no-multiple-empty-lines': 2,
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
    'object-shorthand': 2,
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'sort-keys': 2,
    'sort-keys-fix/sort-keys-fix': 'error',
    'unicorn/no-null': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/number-literal-case': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        // Always try to resolve types under `<root>@types` directory
        // even it doesn't contain any source code, like `@types/unist`
        alwaysTryTypes: true,
      },
    },
  },
};
