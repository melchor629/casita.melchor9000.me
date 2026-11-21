import CircularProgress from '@melchor629/ui/CircularProgress'
import { useEffect, useRef, useState } from 'react'
import { Virtuoso, type Components } from 'react-virtuoso'
import type { DictionaryEntry } from '../jp-utils'
import VocabularyResult from './vocabulary-result'

const virtuosoComponents: Components<DictionaryEntry> = {
  Header: () => <div className="h-17 w-full" />,
  Footer: () => <div className="h-5 w-full" />,
  Scroller: (props) => (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className="-mt-16 w-full max-w-3xl grow"
    />
  ),
  List: (props) => (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className="flex grow flex-col gap-2 overflow-y-auto px-4"
    />
  ),
}

const virtuosoItemRender = (_: number, result: DictionaryEntry) => (
  <VocabularyResult result={result} />
)

/**
 * Renders the vocabulary list with using the provided filter.
 *
 * @param param0 Props.
 */
export default function VocabularyResults({ filter }: Readonly<{ filter: string }>) {
  const vocabularyWorkerRef = useRef<Worker>(null)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<DictionaryEntry[] | null>(null)

  useEffect(() => {
    if (filter) {
      setTimeout(() => {
        vocabularyWorkerRef.current?.postMessage(filter)
        setLoading(true)
      })
    }
  }, [filter])

  useEffect(() => {
    const vocabularyWorker = new Worker(new URL('../vocabulary-worker.js', import.meta.url), {
      type: 'module',
      name: 'jpn-vocab',
    })
    vocabularyWorker.addEventListener(
      'message',
      (ev) => {
        setResults(ev.data as DictionaryEntry[])
        setLoading(false)
      },
      false,
    )
    vocabularyWorkerRef.current = vocabularyWorker
    return () => {
      vocabularyWorkerRef.current = null
      vocabularyWorker.terminate()
    }
  }, [])

  const vocabDaTextClass = 'select-none text-center grow h-full'
  if (!filter) {
    return (
      <div className={vocabDaTextClass}>
        write something in the filter
        <br />
        use t: to filter by type
        <br />
        use c: to filter by chapter
        <br />
        use l: to filter by level (basic or intermediate)
      </div>
    )
  }

  if (results != null && !results.length) {
    return <div className={vocabDaTextClass}>no results found</div>
  }

  return (
    <>
      <div className="fixed top-20">
        <CircularProgress show={loading} />
      </div>
      <Virtuoso
        data={results ?? []}
        itemContent={virtuosoItemRender}
        increaseViewportBy={200}
        components={virtuosoComponents}
      />
    </>
  )
}
