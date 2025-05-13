import type { Ref } from 'preact'
import { forwardRef, memo, type KeyboardEvent, type TargetedEvent } from 'preact/compat'
import { useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from 'preact/hooks'
import * as wanakana from 'wanakana'
import { hiraganaCharRows, katakanaCharRows, toRomaji } from './jp-utils'
import { CharButton, TextArea } from './shared-components'

type WanaKanaInputProps = Readonly<{
  mode: 'hira' | 'kata'
  onLatinChars: (value: string) => void
  ref: Ref<Readonly<{ clear: () => void, add: (jpChar: string) => void }>>
  toggleMode: () => void
}>
const WanaKanaInput = forwardRef(function WanaKanaInput({ mode, onLatinChars, toggleMode }: WanaKanaInputProps, ref: WanaKanaInputProps['ref']) {
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null)

  const onKanaInputChange = useCallback(() => {
    const value = textArea?.value
    const latChars = toRomaji(value ?? '')
    onLatinChars(latChars)
  }, [onLatinChars, textArea?.value])

  useImperativeHandle(ref, () => Object.freeze({
    clear() {
      textArea!.value = ''
    },
    add(jpChar: string) {
      const [start, end] = [textArea!.selectionStart, textArea!.selectionEnd]
      textArea!.setRangeText(jpChar, start, end, 'end')
    },
  }), [textArea])

  useLayoutEffect(() => {
    if (textArea == null) {
      return () => {}
    }

    if (textArea.hasAttribute('data-wanakana-id')) { wanakana.unbind(textArea) }
    wanakana.bind(textArea, { IMEMode: mode === 'hira' ? 'toHiragana' : 'toKatakana' })
    textArea.removeEventListener('input', onKanaInputChange, false)
    textArea.removeEventListener('change', onKanaInputChange, false)
    textArea.addEventListener('input', onKanaInputChange, false)
    textArea.addEventListener('change', onKanaInputChange, false)
  }, [mode, onKanaInputChange, textArea])

  return (
    <TextArea
      ref={setTextArea}
      id="jp-writer"
      class="min-h-48"
      cols={18}
      rows={8}
      onKeyUp={useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
          toggleMode()
        }
      }, [toggleMode])}
    />
  )
})

type KanaCharacterProps = Readonly<{
  addChar: (jp: string, lat: string) => void
  jp: string
  lat: string
}>
function KanaCharacter({ addChar, jp, lat }: KanaCharacterProps) {
  const [text, setText] = useState(jp)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const click = useCallback(() => {
    addChar(jp, lat)
  }, [addChar, jp, lat])

  const renderLatChar = useCallback(() => {
    setText(lat)
  }, [lat])

  const renderJpChar = useCallback((e: TargetedEvent<HTMLButtonElement>) => {
    if (document.activeElement !== e.target) {
      setText(jp)
    }
  }, [jp])

  useLayoutEffect(() => {
    const { current: button } = buttonRef
    button?.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.5)', opacity: 0 },
    ], { duration: 125, easing: 'ease-in-out' })
      .finished
      .then(() => setText(jp))
      .then(() => (
        button?.animate([
          { transform: 'scale(0.5)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ], { duration: 125, easing: 'ease-in-out' })
          .finished
      ))
      .catch(() => {})
  }, [jp])

  return (
    <CharButton
      ref={buttonRef}
      type="button"
      class="px-0 w-12"
      tab-index="1"
      onClick={click}
      onPointerEnter={renderLatChar}
      onPointerLeave={renderJpChar}
      onFocus={renderLatChar}
      onBlur={renderJpChar}
    >
      {text}
    </CharButton>
  )
}

type KanaRowProps = Readonly<{
  addChar: (jpChar: string, latChar: string) => void
  row: ReadonlyArray<readonly [jp: string, lat: string]>
}>
/**
 * Renders a row of kata characters
 */
function KanaRow({ addChar, row }: KanaRowProps) {
  return (
    <div class="flex flex-row justify-center gap-2">
      {row.map(([jp, lat]) => <KanaCharacter key={lat} addChar={addChar} jp={jp} lat={lat} />)}
    </div>
  )
}

type KanaRowsProps = Readonly<{
  addChar: (jpChar: string, latChar: string) => void
  mode: 'kata' | 'hira'
}>
/**
 * Renders the kata rows.
 * @param {{ addChar(jpChar: string, latChar: string): void, mode: 'kata' | 'hira' }} props
 */
const KanaRows = memo(function KanaRows({ addChar, mode }: KanaRowsProps) {
  const charRows = mode === 'hira' ? hiraganaCharRows : katakanaCharRows
  return (
    <div class="flex flex-col gap-2 flex-wrap md:max-h-screen">
      {charRows.map((row) => <KanaRow key={row[1]} addChar={addChar} row={row} />)}
    </div>
  )
})

export default function KanaWriter({ changePage }: { readonly changePage: () => void }) {
  const [latChars, setLatChars] = useState('')
  const [mode, setMode] = useState<'hira' | 'kata'>('hira')
  const wanaKanaRef: WanaKanaInputProps['ref'] = useRef(null)

  const onClear = useCallback(() => {
    wanaKanaRef.current?.clear()
    setLatChars('')
  }, [])

  const toggleMode = useCallback(() => {
    setMode((m) => m === 'hira' ? 'kata' : 'hira')
  }, [])

  const addChar = useCallback((jpChar: string, latChar: string) => {
    wanaKanaRef.current?.add(jpChar)
    setLatChars((l) => l + latChar)
  }, [])

  useLayoutEffect(() => {
    localStorage.setItem('j:kana:mode', mode)
  }, [mode])

  return (
    <>
      <KanaRows mode={mode} addChar={addChar} />
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-3 justify-center">
          <div>
            <CharButton
              variant="secondary"
              tabindex={0}
              onClick={onClear}
            >
              clear
            </CharButton>
          </div>
          <div>
            <CharButton
              variant="secondary"
              tabindex={0}
              onClick={toggleMode}
            >
              {mode === 'hira' ? 'あ' : 'ア'}
              {' '}
              ↔
              {mode === 'kata' ? 'あ' : 'ア'}
            </CharButton>
          </div>
          <div>
            <CharButton
              variant="secondary"
              tabindex={0}
              onClick={changePage}
            >
              dict
            </CharButton>
          </div>
        </div>
        <div class="flex flex-row gap-3 justify-center">
          <WanaKanaInput
            ref={wanaKanaRef}
            mode={mode}
            onLatinChars={setLatChars}
            toggleMode={toggleMode}
          />
          <TextArea
            id="romanji-result"
            class="min-h-48"
            cols={18}
            rows={8}
            readOnly
            autocomplete="off"
            value={latChars}
          />
        </div>
      </div>
    </>
  )
}
