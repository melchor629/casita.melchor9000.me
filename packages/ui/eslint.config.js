import melchor629 from '@melchor629/eslint-config'
import { configs as storybook } from 'eslint-plugin-storybook'

export default [
  ...melchor629({
    dirname: import.meta.dirname,
    env: ['node', 'nodeBuiltin'],
    moduleResolution: 'node-esm',
    ts: true,
  }),
  ...storybook['flat/recommended'],
  {
    files: ['.storybook/**', 'src/**/*.stories.{ts,js,tsx,jsx}'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: true,
      }],
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['src/**/*.{tsx,jsx}'],
    rules: {
      'react/jsx-props-no-spreading': 'off',
    },
  },
]
