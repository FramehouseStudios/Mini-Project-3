const js = require('@eslint/js');
const globals = require('globals');

const sharedRules = {
  ...js.configs.recommended.rules,
  'no-console': 'off',
  'no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    caughtErrors: 'none',
    varsIgnorePattern: '^_',
  }],
};

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'data/*.sqlite*',
      'coverage/**',
      'previous-projects/**',
    ],
  },
  {
    files: [
      '*.js',
      'config/**/*.js',
      'controllers/**/*.js',
      'models/**/*.js',
      'routes/**/*.js',
      'services/**/*.js',
      'test/**/*.js',
      'scripts/**/*.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: sharedRules,
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: sharedRules,
  },
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        module: 'readonly',
      },
    },
    rules: sharedRules,
  },
];
