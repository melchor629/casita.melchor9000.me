import { MenuItem } from '@melchor629/ui'
import { Download, Downloading } from '@melchor629/ui/icons'
import { type FC, useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'

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
    <MenuItem
      onAction={download}
      disabled={preparing || disabled}
      icon={preparing ? <Downloading /> : <Download />}
      label={
        !Array.isArray(metadata)
          ? (metadata?.type === 'dir' ? 'Download Folder' : 'Download')
          : (metadata.length === 1 ? 'Download' : 'Download All')
      }
    />
  )
}

export default DownloadButton
