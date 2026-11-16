import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineMain } from '@storybook/react-vite/node'
import tailwindcss from '@tailwindcss/vite'

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

export default defineMain({
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-mcp'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  features: {
    componentsManifest: true,
    experimentalReactComponentMeta: true,
  },
  viteFinal(config) {
    config.plugins = [
      ...(config.plugins ?? []),
      tailwindcss(),
    ]
    return config
  },
})
