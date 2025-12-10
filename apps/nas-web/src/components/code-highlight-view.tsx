import { useEffect, useState } from 'react'
import { downloadFile } from '../api/fs'
import useApiClient from '../hooks/use-api-client'
import highlightCode from '../workers/code-highlighter'
import { Spinner } from './loaders'
import DotsLoadingAnimation from './loaders/dots'

interface CodeHighlightViewProps {
  readonly module: string
  readonly path: string
  readonly forceLanguage?: string
}

interface CodeHighlightState {
  value: string
  lang?: string
  relevance: number
  highlighted: boolean
}

export default function CodeHighlightView({ forceLanguage, module, path }: CodeHighlightViewProps) {
  const [codeHighlight, setCodeHighlight] = useState<CodeHighlightState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const apiClient = useApiClient()

  useEffect(() => {
    const abort = new AbortController()
    downloadFile(apiClient, module, path, 'text', abort.signal)
      .then((result) => {
        setCodeHighlight({
          relevance: 1,
          value: result as string,
          highlighted: false,
        })
      })
      .catch((e) => !abort.signal.aborted && setError(JSON.stringify(e)))

    return () => abort.abort()
  }, [apiClient, module, path])

  useEffect(() => {
    if (codeHighlight?.highlighted || !codeHighlight?.value) {
      return () => {}
    }

    const abort = new AbortController()
    highlightCode({ code: codeHighlight.value, lang: forceLanguage }, abort.signal)
      .then((result) => {
        if (result.success) {
          setCodeHighlight({
            value: result.result.value,
            lang: result.result.language,
            highlighted: true,
            relevance: result.result.relevance,
          })
        } else {
          setCodeHighlight((v) => (v ? { ...v, highlighted: true } : null))
        }
      })
      .catch((e) => !abort.signal.aborted && setError(JSON.stringify(e)))

    return () => abort.abort()
  }, [codeHighlight?.value, codeHighlight?.highlighted, forceLanguage])

  if (codeHighlight === null && error === null) {
    return (
      <div className="text-center">
        <DotsLoadingAnimation />
        <p>Loading code...</p>
      </div>
    )
  }

  if (codeHighlight === null && error !== null) {
    return (
      <div className="text-center">
        Could not load code
        <br />
        {error}
      </div>
    )
  }

  if (codeHighlight !== null) {
    return (
      <div>
        <p>
          <small>
            {`${codeHighlight.lang ?? 'Unknown'} (${codeHighlight.relevance}%) `}
            {!codeHighlight.highlighted && <Spinner size="sm" />}
          </small>
        </p>
        {}
        <pre><code dangerouslySetInnerHTML={{ __html: codeHighlight.value }} /></pre>
      </div>
    )
  }

  throw new Error('Excusemewtf')
}
