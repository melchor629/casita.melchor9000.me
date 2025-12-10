import { type FC, useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { androidIntent } from '@/utils/url-generator'
import { Android } from '../../icons'
import Button from './button'

interface AndroidButtonProps {
  readonly module: string
  readonly metadata: FileMetadata
  readonly disabled?: boolean
}

const AndroidButton: FC<AndroidButtonProps> = ({ disabled, metadata, module }) => {
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
    <Button onClick={openIntent} disabled={preparing || disabled}>
      <Android width="16px" />
      <span> Open in Android</span>
    </Button>
  )
}

export default AndroidButton
