import { clsx } from 'clsx'
import { useCallback, useRef, useState } from 'preact/hooks'
import type { VocabularyComponentProps } from '../jp-utils'
import AdjectiveTable from './adjective-table'
import BasicVerbTable from './basic-verb-table'
import DemonstrativeTable from './demonstrative-table'
import Details from './details'
import InformalVerbTable from './informal-verb-table'
import JapaneseWithRomaji from './japanese-with-romaji'
import KanjiReadings from './kanji-readings'
import RefLinkStack from './ref-link-stack'

const typesWithDetails = Object.freeze(['verb', 'demonstrative', 'adjective', 'ichidan-verb', 'godan-verb', 'irregular-verb', 'kanji'])

/**
 * Renders the given entry to Preact.
 * @param param0 props
 */
export default function VocabularyResult({ result }: VocabularyComponentProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsDivRef = useRef<HTMLDivElement>(null)
  const hasDetails = result.details || typesWithDetails.includes(result.type) || result.refs != null

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
          <JapaneseWithRomaji
            value={result.value}
            otherValue={result.type === 'noun' ? result.pronuntiation : (result.type === 'kanji' ? `${result.onyomi}・${result.kunyomi}` : undefined)}
          />
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
              {result.type === 'verb' && <BasicVerbTable result={result} />}
              {result.type === 'ichidan-verb' && <InformalVerbTable result={result} />}
              {result.type === 'godan-verb' && <InformalVerbTable result={result} />}
              {result.type === 'irregular-verb' && <InformalVerbTable result={result} />}
              {result.type === 'demonstrative' && <DemonstrativeTable result={result} />}
              {result.type === 'adjective' && <AdjectiveTable result={result} />}
              {result.type === 'kanji' && <KanjiReadings result={result} />}
              {result.details && <Details result={result} />}
              {result.refs && <RefLinkStack result={result} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
