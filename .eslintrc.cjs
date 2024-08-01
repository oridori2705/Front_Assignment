module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/typescript',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-refresh',
    'import',
    'simple-import-sort',
    '@typescript-eslint',
    'prettier'
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      },
      react: {
        version: 'detect'
      }
    }
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index'
        ],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
            position: 'after'
          }
        ]
      }
    ],
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto'
      }
    ],
    'no-console': [
      'error',
      {
        allow: ['error', 'warn']
      }
    ],
    'react/no-unknown-property': ['error', { ignore: ['css'] }]
  }
}
