import { useFloating, offset, autoUpdate } from '@floating-ui/react-dom'
import { type PageLoader, type Metadata, useNavigate, useBlocker } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
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
        className={clsx(
          'bg-elevated-1',
          'rounded-lg',
          'px-6 py-6',
          'outline-hidden outline-2 outline-offset-2',
          'outline-elevated-1',
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
          ? <img className="size-12" src={entry.icon} alt={`${entry.name} icon`} />
          : <div className="flex justify-center items-center size-12">{entry.id}</div>}

        {entry.label && (
          <div className="absolute right-6 bottom-6">{entry.label}</div>
        )}
      </a>

      <div
        ref={setFloating}
        style={floatingStyles}
        className={clsx(
          'fixed top-0 left-0 z-10',
          'pointer-events-none',
          'bg-elevated-1/60 backdrop-blur-sm',
          'rounded-md',
          'px-2 py-1',
          'text-sm',
          'whitespace-nowrap',
          'shadow-lg shadow-black/15 dark:shadow-black/35',
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
          'transform-gpu transition origin-center',
        )}
      >
        {entry.name}
      </div>
    </>
  )
}

export default function DashboardPage({ entries }: PageProps) {
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
      className={clsx(
        'min-h-screen p-4',
        'flex flex-wrap justify-center content-center items-center gap-4',
        fadeInEnded ? 'opacity-100' : 'opacity-0',
        'animate-fade-in animation-easing-linear animation-delay-1000 animation-duration-2s',
      )}
      onAnimationEnd={useCallback(() => setFadeInEnded((v) => !v), [])}
    >
      {entries.map((entry, i) => (
        entry === 'space'
          // eslint-disable-next-line react/no-array-index-key
          ? <div key={`space-${i}`} className="grow w-full" />
          : <DaLink key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
