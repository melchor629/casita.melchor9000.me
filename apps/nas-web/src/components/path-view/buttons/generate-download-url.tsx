import { MenuItem } from '@melchor629/ui'
import { Link } from '@melchor629/ui/icons'
import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import GenerateUrlsModal from '../../modals/generate-urls-modal'

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
      <MenuItem
        onAction={openModal}
        disabled={disabled}
        icon={<Link />}
        label="Generate URLs"
      />

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
