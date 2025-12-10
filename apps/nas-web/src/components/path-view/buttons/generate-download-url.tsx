import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { Link } from '../../icons'
import GenerateUrlsModal from '../../modals/generate-urls-modal'
import Button from './button'

interface GenerateDownloadUrlButtonProps {
  readonly module: string
  readonly metadata: Array<DirectoryMetadata | FileMetadata>
  readonly disabled?: boolean
}

const GenerateDownloadUrl: FC<GenerateDownloadUrlButtonProps> = ({
  disabled = false,
  metadata,
  module,
}) => {
  const [
    metadataToGenerate,
    setMetadataToGenerate,
  ] = useState<Array<DirectoryMetadata | FileMetadata> | null>(null)

  const openModal = useCallback(() => {
    if (!metadata) {
      return
    }

    setMetadataToGenerate(metadata)
  }, [metadata])

  const closeModal = useCallback(() => setMetadataToGenerate(null), [])

  return (
    <>
      <Button onClick={openModal} disabled={disabled}>
        {}
        <Link width="18px" />
        <span> Generate URL</span>
      </Button>

      <GenerateUrlsModal
        show={!!metadataToGenerate}
        onClose={closeModal}
        module={module}
        metadata={metadataToGenerate || []}
      />
    </>
  )
}

export default GenerateDownloadUrl
