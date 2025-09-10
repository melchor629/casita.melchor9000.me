import { useEffect, useMemo, useState } from 'preact/hooks'
import type { DictionaryEntry } from '../jp-utils'
import VocabularyResult from './vocabulary-result'

const resultLimit = 50

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
      <div class={vocabDaTextClass}>
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
    return <div class={vocabDaTextClass}>loading ...</div>
  }

  if (!results.length) {
    return <div class={vocabDaTextClass}>no results found</div>
  }

  return (
    <>
      {results
        .slice(0, resultLimit)
        .map((result) => <VocabularyResult key={`${result.chapter}:${result.type}:${result.value}`} result={result} />)}
      {results.length > resultLimit && (
        <div class={vocabDaTextClass}>
          there are more results that are not shown
          <br />
          tweak the filter to reduce the results
        </div>
      )}
    </>
  )
}
