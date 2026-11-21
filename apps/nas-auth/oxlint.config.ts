import makeOxlintConfig from '@melchor629/oxlint-config'
import reactQuery from '@tanstack/eslint-plugin-query'

export default makeOxlintConfig({
  env: {
    browser: true,
    node: true,
  },
  jsx: true,
  ts: true,
  additional: {
    jsPlugins: ['@tanstack/eslint-plugin-query'],
    overrides: [
      {
        files: ['src/app/**/*.{ts,tsx}'],
        rules: reactQuery.configs['flat/recommended']
          .map((a) => a.rules)
          .reduce((a, r) => Object.assign(a, r), {}),
      },
      {
        files: ['src/app/**/route.{js,ts}'],
        rules: {
          'import/prefer-default-export': 'off',
        },
      },
    ],
  },
})
