import { Link } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { useMemo } from 'preact/hooks'
import type { EntryRef } from '../jp-utils'

/**
 * Renders one link of the ref list.
 * @param props props
 */
const RefLink = ({ refLink: ref }: { readonly refLink: EntryRef }) => {
  const linkTo = useMemo(() => {
    if (ref.type !== 'url') {
      const q = `l:${ref.type.slice(0, 1)} c:${ref.chapter} =${ref.word}`
      return {
        searchParams: new URLSearchParams({ q }),
      }
    }

    return {}
  }, [ref])
  const vocabRefClasses = clsx(
    'px-2 py-1',
    'rounded-sm',
    'cursor-pointer',
    'transition-colors',
    'hover:bg-accent-elevated/20',
  )
  if (ref.type === 'basic') {
    return (
      <Link class={vocabRefClasses} to={linkTo}>
        B
        {ref.chapter}
        {' '}
        {ref.word}
      </Link>
    )
  }

  if (ref.type === 'intermediate') {
    return (
      <Link class={vocabRefClasses} to={linkTo}>
        I
        {ref.chapter}
        {' '}
        {ref.word}
      </Link>
    )
  }

  if (ref.type === 'url') {
    return <a class={vocabRefClasses} href={ref.url.toString()} target="_blank" rel="noreferrer">{ref.name}</a>
  }

  return null
}

export default RefLink
