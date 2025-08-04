module.exports = {
  env: {
    es6: true, // Enable ES6 globals
    node: true, // Enable Node.js globals
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:node/recommended',
    'plugin:promise/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020, // Enable modern ECMAScript features
    sourceType: 'script', // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'import/order': [
      'error',
      { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], 'newlines-between': 'always' },
    ],
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    'node/no-unpublished-import': 'off',
    'node/no-missing-import': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    node: {
      version: 'detect', // Automatically detect the Node.js version
    },
  },
};
