import { useLayoutEffect, useMemo, useState } from 'react'

const useMatchMediaQuery = (query: string) => {
  const [, forceRender] = useState(0)
  const mediaQueryList = useMemo(() => window.matchMedia(query), [query])

  useLayoutEffect(() => {
    const handler = () => forceRender((r) => r + 1)

    mediaQueryList.addEventListener('change', handler, false)
    return () => {
      mediaQueryList.removeEventListener('change', handler, false)
    }
  }, [mediaQueryList])

  return mediaQueryList.matches
}

export default useMatchMediaQuery
