import {
  type PropsWithChildren, useCallback, useLayoutEffect, useMemo,
} from 'react'
import { type DefaultTheme, ThemeContext } from 'styled-components'
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

  const theme = useMemo<DefaultTheme>(() => ({
    aspect,
  }), [aspect])

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', aspect)
  }, [aspect])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
