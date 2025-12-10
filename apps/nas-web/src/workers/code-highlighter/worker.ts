import highlight from 'highlight.js'
import type { CodeHighlightRequest, CodeHighlightResponse } from './types'

onmessage = function onCodeHighlighterMessage(e: MessageEvent<CodeHighlightRequest>) {
  const { code, lang, reqId } = e.data
  try {
    if (lang) {
      const h = highlight.highlight(code, { language: lang })
      postMessage({
        reqId,
        success: true,
        result: {
          language: h.language,
          relevance: h.relevance,
          value: h.value,
        },
      } satisfies CodeHighlightResponse)
    } else {
      const h = highlight.highlightAuto(code)
      postMessage({
        reqId,
        success: true,
        result: {
          language: h.language,
          relevance: h.relevance,
          value: h.value,
          secondBest: h.secondBest && {
            language: h.secondBest.language,
            relevance: h.secondBest.relevance,
            value: h.secondBest.value,
          },
        },
      } satisfies CodeHighlightResponse)
    }
  } catch (error) {
    postMessage({
      reqId,
      success: false,
      error: typeof error === 'object' ? { ...error } : {},
    } satisfies CodeHighlightResponse)
  }
}
