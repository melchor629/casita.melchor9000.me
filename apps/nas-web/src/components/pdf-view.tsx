import { Text } from '@melchor629/ui'
import { useEffect, useState } from 'react'
import { downloadFile } from '../api/fs'
import useApiClient from '../hooks/use-api-client'
import { AppLoader } from './loaders'

interface PdfViewProps {
  readonly module: string
  readonly path: string
}

export default function PdfView({ module, path }: PdfViewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const apiClient = useApiClient()

  useEffect(() => {
    const abort = new AbortController()
    downloadFile(apiClient, module, path, 'blob', abort.signal)
      .then((result) => {
        setPdfUrl(URL.createObjectURL(result as Blob))
      })
      .catch((e) => !abort.signal.aborted && setError(JSON.stringify(e)))

    return () => abort.abort()
  }, [apiClient, module, path])

  if (pdfUrl === null && error === null) {
    return (
      <div className="text-center">
        <AppLoader message="Loading document..." />
      </div>
    )
  }

  if (pdfUrl === null && error !== null) {
    return (
      <div className="text-center">
        <Text size="bodyLarge">Loading PDF contents failed</Text>
        <br />
        {error}
      </div>
    )
  }

  if (pdfUrl !== null) {
    return (
      <div>
        <iframe
          src={pdfUrl}
          className="border-0 w-full -mt-4 -mb-2 rounded-md"
          style={{ minHeight: 'calc(100vh - 176px - 6*1rem)' }}
          title={`${path} PDF Preview`}
        />
      </div>
    )
  }

  throw new Error('Excusemewtf')
}
