import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { basename } from '@/utils/path'
import { plsFromFiles } from '@/utils/url-generator'
import { Downloading, PlaylistPlay } from '../../icons'
import Button from './button'

interface DownloadPlsButtonProps {
  readonly disabled?: boolean
  readonly module: string
  readonly metadata?: DirectoryMetadata | FileMetadata | (DirectoryMetadata | FileMetadata)[]
}

const DownloadPlsButton: FC<DownloadPlsButtonProps> = ({ disabled, metadata, module }) => {
  const apiClient = useApiClient()
  const [preparing, setPreparing] = useState(false)

  const downloadPls = useCallback(() => {
    if (!metadata) {
      return
    }

    let promise: Promise<string | null>
    if (Array.isArray(metadata)) {
      promise = plsFromFiles(
        module,
        metadata.filter((f): f is FileMetadata => f.type === 'file'),
        apiClient,
      )
    } else if (metadata.type === 'dir') {
      promise = plsFromFiles(
        module,
        metadata.contents.filter((f): f is FileMetadata => f.type === 'file'),
        apiClient,
      )
    } else {
      promise = plsFromFiles(module, [metadata], apiClient)
    }

    setPreparing(true)
    promise
      .then((url) => {
        const a = document.createElement('a')
        a.href = url!
        // thanks safari for being weird
        a.download = `${basename(Array.isArray(metadata) ? metadata[0].path : metadata.path)}.pls`
        a.click()
      })
      .catch(() => {})
      .finally(() => setPreparing(false))
  }, [module, metadata, apiClient])

  return (
    <Button onClick={downloadPls} disabled={preparing || disabled}>
      {preparing ? <Downloading width="18px" /> : <PlaylistPlay width="18px" />}
      <span> Download as Playlist</span>
    </Button>
  )
}

export default DownloadPlsButton
