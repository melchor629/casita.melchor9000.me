import { useEffect } from 'react'

export default function ScrollToTopWhen({ deps }: { readonly deps: unknown }) {
  useEffect(() => window.scrollTo(0, 0), [deps])

  return null
}
