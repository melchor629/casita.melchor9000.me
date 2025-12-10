import { type FC, useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { Download, Downloading } from '../../icons'
import Button from './button'

interface DownloadButtonProps {
  readonly module: string
  readonly metadata?: DirectoryMetadata | FileMetadata | Array<DirectoryMetadata | FileMetadata>
  readonly disabled?: boolean
}

const DownloadButton: FC<DownloadButtonProps> = ({ disabled, metadata, module }) => {
  const apiClient = useApiClient()
  const [preparing, setPreparing] = useState(false)

  const download = useCallback(() => {
    if (!metadata) {
      return
    }

    setPreparing(true)
    const all = (Array.isArray(metadata) ? metadata : [metadata])
    getDownloadUrl(module, all.map((file) => file.path), apiClient)
      .then((urls) => {
        for (const url of urls) {
          window.location.assign(url)
        }
      })
      .catch(() => {})
      .finally(() => setPreparing(false))
  }, [module, metadata, apiClient])

  return (
    <Button onClick={download} disabled={preparing || disabled}>
      {preparing ? <Downloading width="18px" /> : <Download width="18px" />}
      {!Array.isArray(metadata) && (metadata?.type === 'dir' ? <span> Download Folder</span> : <span> Download</span>)}
      {Array.isArray(metadata) && <span> Download All</span>}
    </Button>
  )
}

export default DownloadButton
