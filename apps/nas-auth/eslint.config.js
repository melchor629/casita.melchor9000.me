import melchor629 from '@melchor629/eslint-config'
import reactQuery from '@tanstack/eslint-plugin-query'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...melchor629({
    dirname: import.meta.dirname,
    env: ['browser', 'node', 'nodeBuiltin'],
    moduleResolution: 'node-esm',
    ts: true,
  }),
  ...reactQuery.configs['flat/recommended'],
  {
    name: 'extensions',
    settings: {
      'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts'],
    },
    rules: {
      'import-x/extensions': 'off',
    },
  },
  {
    name: 'react-files',
    files: ['src/app/**'],
    rules: {
      // TODO know why these fail with js/jsx files
      'import-x/no-unresolved': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    name: 'api-routes',
    files: ['src/app/**/route.{js,ts}'],
    rules: {
      'import-x/prefer-default-export': 'off',
    },
  },
]
