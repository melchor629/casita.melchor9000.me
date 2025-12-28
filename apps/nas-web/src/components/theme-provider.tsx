import {
  type PropsWithChildren, useCallback, useLayoutEffect, useMemo,
} from 'react'
import useMatchMediaQuery from '../hooks/use-match-media-query'
import { useSettings } from '../hooks/use-settings'

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const preferDarkColorScheme = useMatchMediaQuery('screen and (prefers-color-scheme: dark)')
  const currentTheme = useSettings(useCallback((s) => s.theme, []))
  const aspect = useMemo<'dark' | 'light'>(() => {
    if (currentTheme === 'system') {
      return preferDarkColorScheme ? 'dark' : 'light'
    }

    return currentTheme
  }, [preferDarkColorScheme, currentTheme])

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', aspect)
  }, [aspect])

  return children
}

export default ThemeProvider
