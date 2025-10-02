/* eslint-disable react/jsx-props-no-spreading */
import Markdown, { type MarkdownToJSX } from 'markdown-to-jsx'
import { useMemo } from 'preact/hooks'
import { Fragment } from 'preact/jsx-runtime'
import type { VocabularyComponentProps } from '../jp-utils'

const BasicDetails = ({ result }: VocabularyComponentProps) => (
  <span>
    {useMemo(() => result.details!
      .split('\n')
      .filter((l, i, a) => i + 1 < a.length || l.trim() !== '')
      .map((l, i) => l.length >= 70
        ? `${l} `
        : (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={`${l}:${i}`}>
            {l}
            <br />
          </Fragment>
          ),
      ), [result.details])}
  </span>
)

const mdOptions: MarkdownToJSX.Options = {
  disableAutoLink: true,
  wrapper: 'div',
  overrides: {
    ul: { component: (props) => <ul {...props} class="list-inside" /> },
    li: { component: (props) => <li {...props} class="list-disc [&_ul]:pl-6" /> },
    p: { component: (props) => <p {...props} class="pb-2 last:pb-0" /> },
    iframe: () => null,
    image: () => null,
    video: () => null,
    Sample: {
      component: ({ children: lat, jp }: Readonly<{ jp: string, children: string }>) => (
        <p className="block last-of-group:pb-3">
          <span>{jp.trim()}</span>
          {jp.trim().at(-1) !== '。' && <span>{' '}</span>}
          <span className="text-primary-text-subtle">{lat}</span>
        </p>
      ),
    },
  },
}

// the sequences are for hiragana, katakana, han (kanji and so) and (jp and lat) punctuation signs
// half-sized katakana and others are not included
// see https://stackoverflow.com/questions/19899554/unicode-range-for-japanese
const DetailsSampleRegex = /^([\u3041-\u3096\u30A0-\u30FF\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\u3000-\u303F\uFF01-\uFF5E ]+)->(\n?.+)$/gmu

const IntermediateDetails = ({ result }: VocabularyComponentProps) => (
  <Markdown options={mdOptions}>
    {useMemo(() => (
      result.details!.replaceAll(DetailsSampleRegex, (_, jp: string, lat: string) => {
        return `<Sample jp={${jp}}>${lat.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</Sample>`
      })
    ), [result.details])}
  </Markdown>
)

export default function Details({ result }: VocabularyComponentProps) {
  if (result.level === 'basic') {
    return <BasicDetails result={result} />
  }

  if (result.level === 'intermediate') {
    return <IntermediateDetails result={result} />
  }

  return null
}
