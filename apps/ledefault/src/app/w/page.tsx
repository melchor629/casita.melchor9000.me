import { useFloating, offset, autoUpdate } from '@floating-ui/react-dom'
import { type PageLoader, type Metadata, useNavigate, useBlocker } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { getUser } from '@/auth'
import entries from './entries'

type PageProps = {
  readonly entries: ReadonlyArray<import('./entries').Entry | 'space'>
}

export const metadata: Metadata = {
  title: 'pi/dashboard',
}

export const loader: PageLoader<PageProps> = async (req) => {
  const sub = await getUser(req)
    .then((res) => res.type === 'success' ? res.data.sub : '')
  return {
    entries: entries
      .filter((subEntries) => subEntries === 'space' || !subEntries.limitedTo || subEntries.limitedTo.includes(sub)),
  }
}

function DaLink({ entry }: { readonly entry: import('./entries').Entry }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { floatingStyles, refs: { setFloating, setReference } } = useFloating({
    strategy: 'fixed',
    middleware: [
      offset({ mainAxis: 12 }),
    ],
    open: showTooltip,
    whileElementsMounted: autoUpdate,
  })

  return (
    <>
      <a
        ref={setReference}
        href={entry.url}
        target="_blank"
        referrerPolicy="no-referrer"
        id={`link-${entry.id}`}
        class={clsx(
          'bg-primary-elevated',
          'rounded-lg',
          'px-6 py-6',
          'outline-hidden outline-2 outline-offset-2',
          'outline-primary-elevated',
          'focus:outline-solid active:outline-solid',
          'relative',
          'shadow-lg hover:shadow-xl',
          'transform-gpu transition-all',
          'cursor-pointer',
          'hover:scale-110',
        )}
        onMouseEnter={useCallback(() => setShowTooltip(true), [])}
        onMouseLeave={useCallback(() => setShowTooltip(false), [])}
        rel="noreferrer"
      >
        {entry.icon
          ? <img class="w-12 h-12" src={entry.icon} alt={`${entry.name} icon`} />
          : <div class="flex justify-center items-center w-12 h-12">{entry.id}</div>}

        {entry.label && (
          <div class="absolute right-6 bottom-6">{entry.label}</div>
        )}
      </a>

      <div
        ref={setFloating}
        style={floatingStyles}
        class={clsx(
          'fixed top-0 left-0 z-10',
          'pointer-events-none',
          'bg-primary-elevated',
          'rounded-md',
          'px-2 py-1',
          'text-sm',
          'whitespace-nowrap',
          'shadow-lg shadow-black/15 dark:shadow-black/35',
          showTooltip ? 'opacity-100' : 'opacity-0',
          'transform-gpu transition',
        )}
      >
        {entry.name}
      </div>
    </>
  )
}

export default function Page({ entries }: PageProps) {
  const [fadeInEnded, setFadeInEnded] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const blocker = useBlocker(true)

  const fadeout = useCallback(() => (
    divRef.current!.animate([
      { opacity: 1 },
      { opacity: 0 },
    ], {
      duration: 2000,
      easing: 'ease-in-out',
    })
      .finished
      .then(() => setFadeInEnded(false))
  ), [])

  useEffect(() => {
    const abtctrl = new AbortController()
    window.addEventListener('keyup', (event) => {
      if (event.key === 'h') {
        navigate('/')
      } else if (event.key === 'j') {
        navigate('/j/')
      }
      abtctrl.abort()
    }, { passive: true, signal: abtctrl.signal })
    return () => { if (!abtctrl.signal.aborted) abtctrl.abort() }
  }, [navigate])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      fadeout().catch(() => {}).finally(() => blocker.proceed())
    }
  }, [blocker, fadeout])

  return (
    <div
      ref={divRef}
      class={clsx(
        'min-h-screen p-4',
        'flex flex-wrap justify-center content-center items-center gap-4',
        fadeInEnded ? 'opacity-100' : 'opacity-0',
        'animate-fade-in animation-easing-linear animation-delay-1s animation-duration-2s',
      )}
      onAnimationEnd={useCallback(() => setFadeInEnded((v) => !v), [])}
    >
      {entries.map((entry, i) => (
        entry === 'space'
          // eslint-disable-next-line react/no-array-index-key
          ? <div key={`space-${i}`} class="flex-grow w-full" />
          : <DaLink key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
