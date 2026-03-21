import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { useEffect, useMemo, useState } from 'react'
import { create, themes } from 'storybook/theming'

type StorybookGlobals = {
  theme?: 'dark' | 'light'
}

type StorybookGlobalsUpdatedData = {
  globals: StorybookGlobals
}

export default function ThemeAwareDocsContainer({ children, context }: React.PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState<keyof typeof themes>(() => (context.channel.last('globalsUpdated') as [StorybookGlobalsUpdatedData])[0]?.globals?.theme || 'dark')
  const createdTheme = useMemo(() => create(themes[theme]), [theme])
  useEffect(() => {
    const fn = ({ globals }: StorybookGlobalsUpdatedData) => {
      setTheme(globals.theme as typeof theme)
    }
    context.channel.on('globalsUpdated', fn)
    return () => context.channel.off('globalsUpdated', fn)
  }, [context.channel])
  return <DocsContainer context={context} theme={createdTheme}>{children}</DocsContainer>
}
