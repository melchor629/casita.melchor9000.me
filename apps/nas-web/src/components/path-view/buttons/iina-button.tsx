import { type FC, useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { iina } from '@/utils/url-generator'
import Button from './button'

interface IinaButtonProps {
  readonly module: string
  readonly metadata: FileMetadata
  readonly disabled?: boolean
}

const IinaButton: FC<IinaButtonProps> = ({ disabled, metadata, module }) => {
  const apiClient = useApiClient()
  const [preparing, setPreparing] = useState(false)

  const openOnIina = useCallback(() => {
    if (!metadata) {
      return
    }

    setPreparing(true)
    getDownloadUrl(module, metadata.path, apiClient)
      .then(iina)
      .then((url) => {
        window.location.assign(url)
      })
      .catch(() => {})
      .finally(() => setPreparing(false))
  }, [module, metadata, apiClient])

  return (
    <Button onClick={openOnIina} disabled={preparing || disabled}>
      <img
        src="https://iina.io/images/iina_triangle_s.png"
        alt="iina logo"
        width="18px"
        className="inline-block pb-0.5 invert-100 dark:invert-0"
      />
      <span> Open in iina</span>
    </Button>
  )
}

export default IinaButton
