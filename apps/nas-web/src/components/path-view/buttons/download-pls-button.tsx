import { MenuItem } from '@melchor629/ui'
import { Downloading, PlaylistPlay } from '@melchor629/ui/icons'
import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { basename } from '@/utils/path'
import { plsFromFiles } from '@/utils/url-generator'

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
    <MenuItem
      onAction={downloadPls}
      disabled={preparing || disabled}
      icon={preparing ? <Downloading /> : <PlaylistPlay />}
      label="Download as Playlist"
    />
  )
}

export default DownloadPlsButton
