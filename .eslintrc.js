module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', 'jest', 'node', 'security', 'import', '@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'import/no-cycle': [1, { ignoreExternal: true }],
    'no-underscore-dangle': 0,
    'no-param-reassign': 1,
    'no-multi-spaces': 2,
    'class-methods-use-this': 0,
    'no-console': 'off',
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-extraneous-import': 'off',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        'version': '>=14.17.0',
        'ignores': ['modules']
      }
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },
};
