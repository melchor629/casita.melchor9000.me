import makeOxlintConfig from '@melchor629/oxlint-config'

export default makeOxlintConfig({
  env: {
    browser: true,
    node: true,
  },
  jsx: true,
  ts: true,
  additional: {
    overrides: [
      {
        files: ['src/**/route.ts'],
        rules: {
          'import/prefer-default-export': 'off',
        },
      },
    ],
  },
})
