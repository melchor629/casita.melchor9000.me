import makeOxlintConfig from '@melchor629/oxlint-config'
import { configs as storybook } from 'eslint-plugin-storybook'

export default makeOxlintConfig({
  env: {
    browser: true,
  },
  jsx: true,
  ts: true,
  additional: {
    jsPlugins: ['eslint-plugin-storybook'],
    overrides: [
      {
        files: ['src/**/*.stories.{ts,js,tsx,jsx}'],
        rules: {
          'import/prefer-default-export': 'off',
          'react/rules-of-hooks': 'off',
        },
      },
      {
        files: ['src/**/*.{tsx,jsx}'],
        rules: {
          'react/jsx-props-no-spreading': 'off',
        },
      },
      ...storybook['flat/recommended'].slice(1).map((c) => ({
        files: c.files ?? [],
        rules: c.rules,
      })),
      {
        files: ['generate-index.ts', '.storybook/main.ts', '*.config.ts'],
        env: {
          browser: false,
          node: true,
        },
        rules: {
          'import/no-nodejs-modules': 'off',
        },
      },
      {
        files: ['src/**/*.test.{tsx,jsx}'],
        plugins: ['vitest'],
        rules: {
          'vitest/require-mock-type-parameters': 'allow',
        },
      },
    ],
  },
})
