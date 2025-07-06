import { Link, useNavigate, useSearchParams } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { type TargetedEvent, Fragment } from 'preact/compat'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import {
  type AdjectiveDictionaryEntry,
  type BasicVerbDictionaryEntry,
  type DemonstrativeDictionaryEntry,
  type DictionaryEntry,
  type EntryRef,
  type InformalVerbDictionaryEntry,
  type KanjiEntry,
  toRomaji,
} from './jp-utils'
import { CharButton, NaisTable } from './shared-components'

type ThingProps<T extends DictionaryEntry = DictionaryEntry> = { readonly result: T }

const JapaneseWithRomaji = ({ value }: { readonly value: string }) => (
  <div
    class={clsx(
      'relative',
      'grow',
      'flex flex-col',
      'cursor-help',
      '*:transition',
      'hover:*:first-of-type:opacity-0',
      'hover:*:last-of-type:opacity-100',
    )}
  >
    <span>{value}</span>
    <span class="absolute top-0 left-0 w-full opacity-0">{useMemo(() => toRomaji(value), [value])}</span>
  </div>
)

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
        B
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

/**
 * Renders the stack list of reference links.
 * @param props props
 */
const RefsStack = ({ result: { refs } }: ThingProps) => (
  <div class="flex flex-row justify-end gap-1 mt-6">
    {/* eslint-disable-next-line react/no-array-index-key */}
    {refs!.map((ref, i) => <RefLink key={`${ref.type}:${i}`} refLink={ref} />)}
  </div>
)

/**
 * Renders the readings of the kanji
 * @param props props
 * @returns rendered html
 */
const KanjiReadings = ({ result: { kunyomi, onyomi } }: ThingProps<KanjiEntry>) => (
  <NaisTable>
    <tbody>
      <tr>
        <th>on-yomi</th>
        <td>{useMemo(() => [onyomi].flat().map((value) => JapaneseWithRomaji({ value })), [onyomi])}</td>
      </tr>
      <tr>
        <th>kun-yomi</th>
        <td>{useMemo(() => [kunyomi].flat().map((value) => JapaneseWithRomaji({ value })), [kunyomi])}</td>
      </tr>
    </tbody>
  </NaisTable>
)

/**
 * Renders the verb conjugation table.
 * @param props props
 */
const InformalVerbTable = ({ result }: ThingProps<InformalVerbDictionaryEntry>) => (
  <NaisTable>
    <thead>
      <tr>
        <th class="w-0" />
        <th>Positive</th>
        <th>Negative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Present</th>
        <td>
          <JapaneseWithRomaji value={result.forms.present.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.present.negative} />
        </td>
      </tr>
      <tr>
        <th>Past</th>
        <td>
          <JapaneseWithRomaji value={result.forms.past.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.past.negative} />
        </td>
      </tr>
      <tr>
        <th>te</th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.te} />
        </td>
      </tr>
      <tr>
        <th>let's do</th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.letsDo} />
        </td>
      </tr>
      <tr>
        <th class="text-nowrap">
          want to
          <em>(adj)</em>
        </th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.wantTo} />
        </td>
      </tr>
    </tbody>
    <thead>
      <tr>
        <th><em>(formal)</em></th>
        <th>Positive</th>
        <th>Negative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Present</th>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.present.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.present.negative} />
        </td>
      </tr>
      <tr>
        <th>Past</th>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.past.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.past.negative} />
        </td>
      </tr>
      <tr>
        <th>let's do</th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.formal.mashou} />
        </td>
      </tr>
    </tbody>
  </NaisTable>
)

/**
 * Renders the verb conjugation table.
 * @param props props
 */
const VerbTable = ({ result }: ThingProps<BasicVerbDictionaryEntry>) => (
  <NaisTable>
    <thead>
      <tr>
        <th class="w-0" />
        <th>Positive</th>
        <th>Negative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Present</th>
        <td>
          <JapaneseWithRomaji value={result.forms.present.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.present.negative} />
        </td>
      </tr>
      <tr>
        <th>Past</th>
        <td>
          <JapaneseWithRomaji value={result.forms.past.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.past.negative} />
        </td>
      </tr>
      {result.forms.te && (
        <tr>
          <th>te</th>
          <td colspan={2}>
            <JapaneseWithRomaji value={result.forms.te} />
          </td>
        </tr>
      )}
      {result.forms.mashou && (
        <tr>
          <th>mashou</th>
          <td colspan={2}>
            <JapaneseWithRomaji value={result.forms.mashou} />
          </td>
        </tr>
      )}
      {result.forms.tai && (
        <tr>
          <th>
            tai
            <em>(adj)</em>
          </th>
          <td colspan={2}>
            <JapaneseWithRomaji value={result.forms.tai} />
          </td>
        </tr>
      )}
    </tbody>
  </NaisTable>
)

/**
 * Renders the demostratives table.
 * @param param0 props
 */
const DemonstrativeTable = ({ result }: ThingProps<DemonstrativeDictionaryEntry>) => (
  <>
    <NaisTable>
      <thead>
        <tr>
          <th class="w-0">Tipo</th>
          <th>Japonés</th>
          <th>Significado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>cerca locutor</th>
          <td>
            <JapaneseWithRomaji value={result.forms.k[0]} />
          </td>
          <td>{result.forms.k[1]}</td>
        </tr>
        <tr>
          <th>cerca oyente</th>
          <td>
            <JapaneseWithRomaji value={result.forms.s[0]} />
          </td>
          <td>{result.forms.s[1]}</td>
        </tr>
        <tr>
          <th>lejos</th>
          <td>
            <JapaneseWithRomaji value={result.forms.a[0]} />
          </td>
          <td>{result.forms.a[1]}</td>
        </tr>
        <tr>
          <th>interrogativo</th>
          <td>
            <JapaneseWithRomaji value={result.forms.d[0]} />
          </td>
          <td>{result.forms.d[1]}</td>
        </tr>
      </tbody>
    </NaisTable>

    <span>
      Este demostrativo actúa como un
      {' '}
      {result.actsAs === 'adjective' ? 'adjetivo' : 'sustantivo'}
      .
      {result.details && (
        <>
          <br />
          <br />
        </>
      )}
    </span>
  </>
)

/**
 * Renders the adjective conjugation table.
 * @param param0 props
 */
const AdjectiveTable = ({ result }: ThingProps<AdjectiveDictionaryEntry>) => (
  <NaisTable>
    <thead>
      <tr>
        <th class="w-0" />
        <th>Positive</th>
        <th>Negative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Present</th>
        <td>
          <JapaneseWithRomaji value={result.forms.present.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.present.negative} />
        </td>
      </tr>
      <tr>
        <th>Past</th>
        <td>
          <JapaneseWithRomaji value={result.forms.past.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.past.negative} />
        </td>
      </tr>
    </tbody>
  </NaisTable>
)

/**
 * Renders the details..
 * @param param0 props
 */
const Details = ({ result }: ThingProps) => (
  <span>
    {result.details!
      .split('\n')
      .filter((l, i, a) => i + 1 < a.length || l.trim() !== '')
      .map((l) => l.length >= 70
        ? `${l} `
        : (
          <Fragment key={l}>
            {l}
            <br />
          </Fragment>
          ),
      )}
  </span>
)

const typesWithDetails = Object.freeze(['verb', 'demonstrative', 'adjective', 'ichidan-verb', 'godan-verb', 'irregular-verb', 'kanji'])

/**
 * Renders the given entry to Preact.
 * @param param0 props
 */
function VocabularyResult({ result }: ThingProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsDivRef = useRef<HTMLDivElement>(null)
  const hasDetails = result.details || typesWithDetails.includes(result.type)

  const detailsButtonClick = useCallback(() => {
    setDetailsOpen((v) => !v)
    const { current: detailsDiv } = detailsDivRef
    if (!detailsDiv) {
      return
    }

    if (!detailsOpen) {
      detailsDiv.animate([
        { height: '0px' },
        { height: `${detailsDiv.scrollHeight}px` },
      ], { duration: 115, fill: 'auto', easing: 'ease-in-out' })
      detailsDiv.style.height = 'auto'
    } else {
      detailsDiv.animate([
        { height: `${detailsDiv.scrollHeight}px` },
        { height: '0px' },
      ], { duration: 115, fill: 'auto', easing: 'ease-in-out' })
      detailsDiv.style.height = '0px'
    }
  }, [detailsOpen])

  return (
    <div
      class={clsx(
        'bg-accent-elevated/15',
        'border border-accent-main-light dark:border-accent-main-dark',
        'px-2 py-1',
        'shadow-xs shadow-accent-elevated',
        'rounded-md',
        'flex flex-row gap-2',
      )}
    >
      <div class="my-0.5 flex flex-col items-center gap-1 min-w-[28px]">
        {hasDetails && (
          <button
            type="button"
            class={clsx(
              'size-6',
              'p-1',
              'text-xs leading-none',
              'rounded-full',
              'border-fuchsia-200',
              'bg-accent-main-light/35 dark:bg-accent-main-dark/40',
              'cursor-pointer',
              'hover:bg-accent-main-light/25 hover:dark:bg-accent-main-dark/30',
              'active:opacity-80',
              'transition duration-75 ease-in-out',
              detailsOpen && 'rotate-180',
            )}
            onClick={detailsButtonClick}
          >
            ▽
          </button>
        )}
      </div>

      <div
        class={clsx(
          'grow',
          'flex flex-row flex-wrap',
          'gap-x-2 gap-y-1',
          'items-center',
        )}
      >
        <div class="grow">
          <JapaneseWithRomaji value={result.value} />
          <div class="uppercase text-xs opacity-75 select-none">
            {result.type}
            {' · '}
            {result.level === 'basic' && 'B'}
            {result.level === 'intermediate' && 'I'}
            {result.chapter}
          </div>
        </div>
        <div class="p-0">
          {result.meaning}
        </div>
        {hasDetails && (
          <div class="h-0 -mt-1 min-w-full overflow-hidden" ref={detailsDivRef}>
            <div class="py-1">
              {result.type === 'verb' && <VerbTable result={result} />}
              {result.type === 'ichidan-verb' && <InformalVerbTable result={result} />}
              {result.type === 'godan-verb' && <InformalVerbTable result={result} />}
              {result.type === 'irregular-verb' && <InformalVerbTable result={result} />}
              {result.type === 'demonstrative' && <DemonstrativeTable result={result} />}
              {result.type === 'adjective' && <AdjectiveTable result={result} />}
              {result.type === 'kanji' && <KanjiReadings result={result} />}
              {result.details && <Details result={result} />}
              {result.refs && <RefsStack result={result} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Renders the vocabulary list with using the provided filter.
 * @param param0 Props.
 */
function VocabularyResults({ filter }: Readonly<{ filter: string }>) {
  const vocabularyWorker = useMemo(() => {
    // SSR trick
    if (typeof Worker !== 'undefined') {
      return new Worker(
        new URL('./vocabulary-worker.js', import.meta.url),
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

  return results
    .slice(0, 100)
    .map((result) => <VocabularyResult key={`${result.chapter}:${result.value}`} result={result} />)
}

export default function Vocabulary({ changePage }: { readonly changePage: () => void }) {
  const searchParams = useSearchParams()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const filterFromSearchParams = searchParams.get('q')

  const setFilter = useCallback((value: string) => {
    if (filterFromSearchParams) {
      navigate({ searchParams: new URLSearchParams() })
    }

    setInputValue(value)
  }, [filterFromSearchParams, navigate])

  useEffect(() => {
    setInputValue(localStorage.getItem('j:vocabInput') || '')
  }, [])

  useEffect(() => {
    localStorage.setItem('j:vocabInput', inputValue)
  }, [inputValue])

  const filter = filterFromSearchParams || inputValue
  return (
    <>
      <div class="flex gap-2 max-w-screen-md w-full pt-4 px-4 pb-4 bg-primary-bg/30 backdrop-blur-sm z-10">
        <input
          type="text"
          id="vocab-filter"
          class={clsx(
            'bg-primary-subtle hover:bg-primary-hover',
            'px-2 py-1',
            'grow',
            'rounded-md shadow-md',
            'outline-2 outline-offset-2',
            'outline-primary-hover',
            'not-focus:not-active:outline-hidden',
            'transition-colors',
          )}
          placeholder="write something..."
          value={inputValue}
          onInput={useCallback((ev: TargetedEvent<HTMLInputElement>) => setFilter(ev.currentTarget.value), [setFilter])}
        />
        <div>
          <CharButton
            variant="secondary"
            id="kana-writer-changer"
            tabIndex={0}
            onClick={changePage}
          >
            kana
          </CharButton>
        </div>
      </div>
      <div
        class="flex grow flex-col gap-2 -mt-16 px-4 pt-17 pb-5 w-full max-w-screen-md overflow-y-auto"
        id="vocab-results"
      >
        <VocabularyResults filter={filter} />
      </div>
    </>
  )
}
