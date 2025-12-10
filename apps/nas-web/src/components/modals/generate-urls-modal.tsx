import {
  type FC, useCallback, useEffect, useId, useState,
} from 'react'
import baseUrl from '@/api/base-url'
import { createAlias } from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { ContentCopy, Done } from '../icons'
import Modal from '../modal-view'

interface GenerateUrlsModalProps {
  readonly show: boolean
  readonly onClose: () => void
  readonly module: string
  readonly metadata: Array<DirectoryMetadata | FileMetadata>
}

const GeneratedUrl = ({ path, url }: { readonly path: string, readonly url: string }) => {
  const [isCopied, setIsCopied] = useState(false)
  const id = useId()

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }).catch(() => setIsCopied(false))
  }, [url])

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{path}</label>
      <div className="input-group">
        <input type="url" className="form-control" id={id} value={url} readOnly />
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={copyUrl}
        >
          {isCopied ? <Done height="15px" /> : <ContentCopy height="15px" />}
        </button>
      </div>
    </div>
  )
}

const GenerateUrlsModal: FC<GenerateUrlsModalProps> = ({
  metadata,
  module,
  onClose,
  show,
}) => {
  const apiClient = useApiClient()
  const [generatedUrls, setGeneratedUrls] = useState<[string, string][] | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const id = useId()

  const copyAllUrls = useCallback(() => {
    const text = (generatedUrls || [])
      .map(([, url]) => url)
      .join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }).catch(() => setIsCopied(false))
  }, [generatedUrls])

  useEffect(() => {
    if (show && metadata.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGeneratedUrls(null)

      createAlias(apiClient, module, metadata.map((m) => m.path))
        .then(({ url, urls }) => {
          const baseUrlWithoutSlash = baseUrl.replace(/\/$/, '')
          if (Object.keys(urls).length === 1) {
            setGeneratedUrls([[Object.keys(urls)[0], baseUrlWithoutSlash + url]])
          } else {
            setGeneratedUrls(
              Object.entries(urls).map(([key, path]) => [key, baseUrlWithoutSlash + path]),
            )
          }
        }).catch(() => setGeneratedUrls(null))
    }
  }, [apiClient, module, show, metadata])

  return (
    <Modal
      id={`download-url-${id}`}
      title={`Generated Download URL${metadata.length > 1 ? 's' : ''}`}
      show={show}
      onClose={onClose}
      size="lg"
      portal
    >
      <p className="text-muted my-2">
        {metadata.length === 1 ? 'This URL is' : 'These URLs are'}
        &nbsp;valid for the following 12 hours, after that,&nbsp;
        {metadata.length === 1 ? 'it' : 'they'}
        &nbsp;won&apos;t work anymore…
      </p>
      {generatedUrls === null && (
        <p className="text-muted text-center mt-2">
          Generating...
        </p>
      )}
      {generatedUrls !== null && metadata.length > 1 && (
        <div className="text-center my-3">
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={copyAllUrls}
          >
            {isCopied ? <Done height="15px" /> : <ContentCopy height="15px" />}
            <span> Copy all URLs</span>
          </button>
        </div>
      )}
      {generatedUrls !== null && (
        generatedUrls
          .map(([path, url]) => <GeneratedUrl key={path} path={path} url={url} />)
      )}
    </Modal>
  )
}

export default GenerateUrlsModal
