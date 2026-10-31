/* eslint-disable react/jsx-props-no-spreading */
import type { MarkdownToJSX } from 'markdown-to-jsx'
import Markdown, { RuleType } from 'markdown-to-jsx/react'
import { Fragment, useMemo } from 'react'
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

export const JP_UNICODE_RANGE = /[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}]+/ug
const mdOptions: MarkdownToJSX.Options = {
  disableAutoLink: true,
  wrapper: 'div',
  overrides: {
    ul: { component: (props) => <ul {...props} className="list-inside" /> },
    li: { component: (props) => <li {...props} className="list-disc [&_ul]:pl-6" /> },
    p: { component: (props) => <p {...props} className="pb-2 last:pb-0" /> },
    iframe: () => null,
    image: () => null,
    video: () => null,
    Sample: {
      component: ({ children: jp, hasSpacing, lat }: Readonly<{ lat: string, children: string, hasSpacing: boolean }>) => (
        <p className="block last-of-group:pb-3">
          <span className="jp-furi">{jp}</span>
          {!hasSpacing && <span>&nbsp;&nbsp;</span>}
          <span className="text-text-secondary">{lat}</span>
        </p>
      ),
    },
  },
  renderRule(next, node, renderChildren, state) {
    if (node.type === RuleType.text && !state.inAnchor) {
      const matches = node.text.matchAll(JP_UNICODE_RANGE).toArray();
      if (matches.length === 0) return node.text;
      return <>{matches
        .flatMap((match, i) => {
          const prevMatch = matches[i - 1];
          const startIndex = prevMatch ? prevMatch.index + prevMatch[0].length : 0;
          return [
            node.text.slice(startIndex, match.index),
            <span className="jp-furi" key={match[0]+i}>{match[0]}</span>,
          ];
        })
        .concat(node.text.slice(matches.at(-1)!.index + matches.at(-1)![0].length))
        .filter((t) => !!t)}</>
    }

    if (node.type === RuleType.link && node.target?.startsWith('^')) {
      const clonedState = structuredClone(state)
      clonedState.inAnchor = true
      if (!Number.isNaN(Number.parseInt(node.target.slice(1)))) {
        return <span className={`jp-furi jp-furi-${node.target.slice(1)}`}>{renderChildren(node.children, clonedState)}</span>
      }

      return (
        <ruby className="jp-simple">
          {renderChildren(node.children, clonedState)}
          <rt className="text-[60%]">{node.target.slice(1)}</rt>
        </ruby>
      )
    }

    return next()
  },
}

// the sequences are for hiragana, katakana, han (kanji and so) and (jp and lat) punctuation signs
// half-sized katakana and others are not included
// see https://stackoverflow.com/questions/19899554/unicode-range-for-japanese
const DetailsSampleRegex = /^([\u3041-\u3096\u30A0-\u30FF\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\u3000-\u303F\uFF01-\uFF5E [\]^()]+)->(\n?.+)$/gmu

const IntermediateDetails = ({ result }: VocabularyComponentProps) => (
  <Markdown options={mdOptions}>
    {useMemo(() => (
      result.details!.replaceAll(DetailsSampleRegex, (_, jp: string, lat: string) => {
        return `<Sample lat={${lat.trim()}} hasSpacing={${jp.endsWith('。')}}>${jp.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').trim()}</Sample>`
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
