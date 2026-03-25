import { useEffect, useMemo, useState } from 'react'
import { Virtuoso, type Components } from 'react-virtuoso'
import type { DictionaryEntry } from '../jp-utils'
import VocabularyResult from './vocabulary-result'

const virtuosoComponents: Components<DictionaryEntry> = {
  Header: () => <div className="w-full h-17" />,
  Footer: () => <div className="w-full h-5" />,
  // eslint-disable-next-line react/jsx-props-no-spreading
  Scroller: (props) => <div {...props} className="grow w-full max-w-3xl -mt-16" />,
  // eslint-disable-next-line react/jsx-props-no-spreading
  List: (props) => <div {...props} className="flex grow flex-col gap-2 px-4 overflow-y-auto" />,
}

const virtuosoItemRender = (_: number, result: DictionaryEntry) => <VocabularyResult result={result} />

/**
 * Renders the vocabulary list with using the provided filter.
 * @param param0 Props.
 */
export default function VocabularyResults({ filter }: Readonly<{ filter: string }>) {
  const vocabularyWorker = useMemo(() => {
    // SSR trick
    if (typeof Worker !== 'undefined') {
      return new Worker(
        new URL('../vocabulary-worker.js', import.meta.url),
        { type: 'module', name: 'jpn-vocab' },
      )
    }

    return null! as Worker
  }, [])
  const [results, setResults] = useState<DictionaryEntry[] | null>(null)

  useEffect(() => {
    if (filter) {
      vocabularyWorker.postMessage(filter)
    }
  }, [filter, vocabularyWorker])

  useEffect(() => {
    vocabularyWorker.addEventListener('message', (ev) => {
      setResults(ev.data as DictionaryEntry[])
    }, false)
    return () => {
      vocabularyWorker.terminate()
    }
  }, [vocabularyWorker])

  const vocabDaTextClass = 'select-none text-center'
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

  if (results == null) {
    return <div className={vocabDaTextClass}>loading ...</div>
  }

  if (!results.length) {
    return <div className={vocabDaTextClass}>no results found</div>
  }

  return (
    <Virtuoso
      data={results}
      itemContent={virtuosoItemRender}
      initialItemCount={50}
      minOverscanItemCount={15}
      components={virtuosoComponents}
      // key={`${result.chapter}:${result.type}:${result.value}`}
    />
  )
}
