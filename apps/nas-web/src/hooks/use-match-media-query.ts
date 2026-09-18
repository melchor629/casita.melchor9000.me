import { useSyncExternalStore, useMemo, useCallback } from 'react'

const useMatchMediaQuery = (query: string) => {
  const mediaQueryList = useMemo(() => window.matchMedia(query), [query])

  const subscribe = useCallback((callback: () => void) => {
    mediaQueryList.addEventListener('change', callback)
    return () => mediaQueryList.removeEventListener('change', callback)
  }, [mediaQueryList])

  const getSnapshot = useCallback(() => mediaQueryList.matches, [mediaQueryList])

  return useSyncExternalStore(subscribe, getSnapshot)
}

export default useMatchMediaQuery
