import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { definePreview } from '@storybook/react-vite'
import '../styles/storybook.css'
import ThemeAwareDocsContainer from './helpers/theme-aware-docs-container'

export default definePreview({
  decorators: [
    withThemeByDataAttribute({
      defaultTheme: 'dark',
      themes: {
        dark: 'dark',
        light: 'light',
      },
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      container: ThemeAwareDocsContainer,
    },
  },
  addons: [addonA11y(), addonDocs()],
})
