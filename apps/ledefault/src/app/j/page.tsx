import { useBlocker, useNavigate, type Metadata } from '@melchor629/nice-ssr'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import KanaWriter from './kana-writer'
import Vocabulary from './vocabulary'

export const metadata: Metadata = {
  title: 'pi/japanese',
}

export default function JapanesePage() {
  const kanaWriterRef = useRef<HTMLDivElement>(null)
  const vocabRef = useRef<HTMLDivElement>(null)
  const [mutState] = useState<{ animating?: boolean, current: 'vocab' | 'kana-writer' }>(() => ({
    current: null!,
  }))
  const navigate = useNavigate()
  const blocker = useBlocker(useMemo(() => ({ current, next }) => current.pathname !== next.pathname, []))

  const changePage = useCallback(async (page: 'vocab' | 'kana-writer' | null) => {
    const pageDivs = Object.freeze({
      vocab: vocabRef.current,
      'kana-writer': kanaWriterRef.current,
    })
    const keyframes = [
      { opacity: 1 },
      { opacity: 0 },
    ]
    const optionsIn = { duration: 1000, direction: 'reverse' as const }
    const optionsOut = { duration: 1000 }

    if (mutState.animating) {
      return
    }

    mutState.animating = true

    const fns = []
    const currentPageDiv = pageDivs[mutState.current]
    const nextPageDiv = pageDivs[page!]
    if (currentPageDiv) {
      const anim = currentPageDiv.animate(keyframes, optionsOut)
      currentPageDiv.classList.add('opacity-0')
      fns.push(anim.finished.then(() => currentPageDiv.classList.add('invisible', 'hidden')))
    }
    mutState.current = page!
    if (nextPageDiv) {
      const anim = nextPageDiv.animate(keyframes, optionsIn)
      nextPageDiv.classList.remove('opacity-0', 'invisible', 'hidden')
      fns.push(anim.finished)
      localStorage.setItem('j:mode', page!)
    }

    await Promise.all(fns)
    mutState.animating = false
  }, [mutState])

  useEffect(() => {
    const abtctrl = new AbortController()
    window.addEventListener('keyup', (event) => {
      if (event.target !== document.body) {
        return
      }

      if (event.key === 'j') {
        navigate('/')
        abtctrl.abort()
      } else if (event.key === 'h') {
        navigate('/w/')
        abtctrl.abort()
      }
    }, { passive: true, signal: abtctrl.signal })
    return () => { if (!abtctrl.signal.aborted) abtctrl.abort() }
  }, [navigate])

  useEffect(() => {
    const storedValue = localStorage.getItem('j:mode')
    if (storedValue === 'kana-writer' || storedValue === 'vocab') {
      void changePage(storedValue)
    } else {
      void changePage('kana-writer')
    }
  }, [changePage])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      changePage(null).catch(() => {}).finally(() => blocker.proceed())
    }
  }, [blocker, changePage])

  const daContainer = `
    absolute top-0 left-0
    min-h-screen md:max-h-screen
    w-screen
    flex flex-col
    justify-center content-center items-center
  `
  return (
    <>
      <div
        class={clsx(
          daContainer,
          'p-4 gap-y-4 gap-x-6',
          'md:flex-wrap',
          'opacity-0 invisible hidden',
        )}
        ref={kanaWriterRef}
      >
        <KanaWriter changePage={useCallback(() => void changePage('vocab'), [changePage])} />
      </div>
      <div
        class={clsx(
          daContainer,
          'max-h-screen',
          'opacity-0 invisible hidden',
        )}
        ref={vocabRef}
      >
        <Vocabulary changePage={useCallback(() => void changePage('kana-writer'), [changePage])} />
      </div>
    </>
  )
}
