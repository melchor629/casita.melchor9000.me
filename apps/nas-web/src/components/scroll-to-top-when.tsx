import { useState } from 'react'

export default function ScrollToTopWhen({ deps }: { readonly deps: unknown }) {
  const [prevDeps, setPrevDeps] = useState(deps)
  if (!Object.is(prevDeps, deps)) {
    window.scrollTo(0, 0)
    setPrevDeps(deps)
  }

  return null
}
