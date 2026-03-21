import { MenuItem } from '@melchor629/ui'
import { Android } from '@melchor629/ui/icons'
import { useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { androidIntent } from '@/utils/url-generator'

interface AndroidButtonProps {
  readonly module: string
  readonly metadata: FileMetadata
  readonly disabled?: boolean
}

const AndroidButton = ({ disabled, metadata, module }: AndroidButtonProps) => {
  const apiClient = useApiClient()
  const [preparing, setPreparing] = useState(false)

  const openIntent = useCallback(() => {
    if (!metadata) {
      return
    }

    setPreparing(true)
    getDownloadUrl(module, metadata.path, apiClient)
      .then((url) => androidIntent(url, metadata.mime?.mime ?? 'application/octet-stream'))
      .then((url) => {
        window.location.assign(url)
      })
      .catch(() => {})
      .finally(() => setPreparing(false))
  }, [module, metadata, apiClient])

  return (
    <MenuItem
      onAction={openIntent}
      disabled={preparing || disabled}
      icon={<Android />}
      label="Open in Android"
    />
  )
}

export default AndroidButton
