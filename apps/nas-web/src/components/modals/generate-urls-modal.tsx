import { Button, Dialog, Text, TextInput } from '@melchor629/ui'
import { ContentCopy, Done } from '@melchor629/ui/icons'
import {
  type FC, useCallback, useEffect, useId, useState,
} from 'react'
import baseUrl from '@/api/base-url'
import { createAlias } from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'

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
    <div className="mb-3 flex">
      <TextInput
        type="url"
        id={id}
        readOnly
        value={url}
        fullWidth
        endAdornment={(
          <Button
            type="button"
            variant="text"
            color="neutral"
            size="small"
            onClick={copyUrl}
            icon={isCopied ? <Done /> : <ContentCopy />}
          />
        )}
      >
        {path}
      </TextInput>
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
    <Dialog
      id={`download-url-${id}`}
      title={`Generated Download URL${metadata.length > 1 ? 's' : ''}`}
      show={show}
      onClose={onClose}
      size="extra-large"
      portal
    >
      <Text color="textSecondary" className="mb-2">
        {metadata.length === 1 ? 'This URL is' : 'These URLs are'}
        &nbsp;valid for the following 12 hours, after that,&nbsp;
        {metadata.length === 1 ? 'it' : 'they'}
        &nbsp;won&apos;t work anymore…
      </Text>
      {generatedUrls === null && (
        <Text color="textSecondary" align="center" className="mt-2">
          Generating...
        </Text>
      )}
      {generatedUrls !== null && metadata.length > 1 && (
        <div className="text-end my-3">
          <Button
            type="button"
            variant="text"
            onClick={copyAllUrls}
            icon={isCopied ? <Done /> : <ContentCopy />}
          >
            <span>Copy all URLs</span>
          </Button>
        </div>
      )}
      {generatedUrls !== null && (
        generatedUrls
          .map(([path, url]) => <GeneratedUrl key={path} path={path} url={url} />)
      )}
    </Dialog>
  )
}

export default GenerateUrlsModal
