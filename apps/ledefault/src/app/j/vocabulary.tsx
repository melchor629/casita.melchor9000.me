import { useNavigate, useSearchParams } from '@melchor629/nice-ssr'
import { clsx } from '@melchor629/ui/utils'
import { useCallback, useEffect, useState, type InputEvent } from 'react'
import { CharButton } from './shared-components'
import VocabularyResults from './vocabulary/vocabulary-results'

export default function Vocabulary({ changePage }: { readonly changePage: () => void }) {
  const searchParams = useSearchParams()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const filterFromSearchParams = searchParams.get('q')

  const setFilter = useCallback(
    (value: string) => {
      if (filterFromSearchParams) {
        navigate({ searchParams: new URLSearchParams() })
      }

      setInputValue(value)
    },
    [filterFromSearchParams, navigate],
  )

  useEffect(() => {
    const id = setTimeout(() => setInputValue(localStorage.getItem('j:vocabInput') || ''))
    return () => clearTimeout(id)
  }, [])

  const filter = filterFromSearchParams || inputValue
  return (
    <>
      <div className="bg-primary-bg/30 z-10 flex w-full max-w-3xl gap-2 px-4 pt-4 pb-4 backdrop-blur-sm">
        <input
          type="text"
          id="vocab-filter"
          className={clsx(
            'bg-elevated-2 hover:bg-elevated-2/80',
            'px-2 py-1',
            'grow',
            'rounded-md shadow-md',
            'outline-2 outline-offset-2',
            'outline-elevated-2',
            'not-focus:not-active:outline-hidden',
            'transition-colors',
          )}
          placeholder="write something..."
          value={inputValue}
          onInput={useCallback(
            (ev: InputEvent<HTMLInputElement>) => {
              setFilter(ev.currentTarget.value)
              localStorage.setItem('j:vocabInput', ev.currentTarget.value)
            },
            [setFilter],
          )}
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
      <VocabularyResults filter={filter} />
    </>
  )
}
