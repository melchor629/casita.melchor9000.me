import melchor629 from '@melchor629/eslint-config'

export default [
  ...melchor629({
    dirname: import.meta.dirname,
    ts: true,
  }),
  {
    files: ['src/**/route.ts'],
    rules: {
      'import-x/prefer-default-export': 'off',
    },
  },
]
