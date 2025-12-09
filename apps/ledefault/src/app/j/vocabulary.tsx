import { useNavigate, useSearchParams } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { CharButton } from './shared-components'
import VocabularyResults from './vocabulary/vocabulary-results'

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
    const id = setTimeout(() => setInputValue(localStorage.getItem('j:vocabInput') || ''))
    return () => clearTimeout(id)
  }, [])

  const filter = filterFromSearchParams || inputValue
  return (
    <>
      <div className="flex gap-2 max-w-screen-md w-full pt-4 px-4 pb-4 bg-primary-bg/30 backdrop-blur-sm z-10">
        <input
          type="text"
          id="vocab-filter"
          className={clsx(
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
          onInput={useCallback((ev: FormEvent<HTMLInputElement>) => {
            setFilter(ev.currentTarget.value)
            localStorage.setItem('j:vocabInput', ev.currentTarget.value)
          }, [setFilter])}
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
        className="flex grow flex-col gap-2 -mt-16 px-4 pt-17 pb-5 w-full max-w-screen-md overflow-y-auto"
        id="vocab-results"
      >
        <VocabularyResults filter={filter} />
      </div>
    </>
  )
}
