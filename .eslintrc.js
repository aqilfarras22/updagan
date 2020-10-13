// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false
    },
    allowImportExportEverywhere: true,
  },
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  // required to lint *.vue files
  plugins: ['html'],
  extends: 'eslint:recommended',
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': [
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
        ],
      },
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': {
      enabled: true
    },
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'function-paren-newline': 'off',
    'object-curly-newline': ['error', { consistent: true }],
    'linebreak-style': 0,
  },
};
