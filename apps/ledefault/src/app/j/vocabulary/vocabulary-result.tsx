import Collapse from '@melchor629/ui/Collapse'
import { ArrowUpward } from '@melchor629/ui/icons'
import { clsx } from 'clsx'
import { memo, useCallback, useState } from 'react'
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
 * Renders the given entry to the list.
 * @param param0 props
 */
const VocabularyResult = memo(function VocabularyResult({ result }: VocabularyComponentProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const hasDetails = result.details || typesWithDetails.includes(result.type) || result.refs != null

  const detailsButtonClick = useCallback(() => {
    setDetailsOpen((v) => !v)
  }, [])

  return (
    <div
      className={clsx(
        'bg-primary-main/15',
        'border border-primary-main',
        'px-2 py-1',
        'shadow-xs shadow-accent-elevated',
        'rounded-md',
        'flex flex-row gap-2',
      )}
    >
      <div className="my-0.5 flex flex-col items-center gap-1 min-w-7">
        {hasDetails && (
          <button
            type="button"
            className={clsx(
              'size-6',
              'p-1',
              'text-base leading-none',
              'rounded-full',
              'bg-primary-main/35',
              'cursor-pointer',
              'hover:bg-primary-main/25',
              'active:opacity-80',
              'transition duration-75 ease-in-out',
              !detailsOpen && 'rotate-180',
            )}
            onClick={detailsButtonClick}
          >
            <ArrowUpward />
          </button>
        )}
      </div>

      <div
        className={clsx(
          'grow',
          'flex flex-row flex-wrap',
          'gap-x-2 gap-y-1',
          'items-center',
        )}
      >
        <div className="grow">
          <JapaneseWithRomaji
            value={result.value}
            otherValue={'pronuntiation' in result && result.pronuntiation
              ? result.pronuntiation
              : (result.type === 'kanji' ? `${result.onyomi}・${result.kunyomi}` : undefined)}
          />
          <div className="uppercase text-xs opacity-75 select-none">
            {result.type}
            {' · '}
            {result.level === 'basic' && 'B'}
            {result.level === 'intermediate' && 'I'}
            {result.chapter}
          </div>
        </div>
        <div className="p-0">
          {result.meaning}
        </div>
        {hasDetails && (
          <Collapse className="-mt-1 min-w-full duration-500 aria-hidden:duration-500" show={detailsOpen}>
            <div className="py-1">
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
          </Collapse>
        )}
      </div>
    </div>
  )
})

export default VocabularyResult
