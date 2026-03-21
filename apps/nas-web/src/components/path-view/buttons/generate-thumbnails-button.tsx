import { MenuItem } from '@melchor629/ui'
import { PhotoLibrary } from '@melchor629/ui/icons'
import { type FC, useCallback } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'

interface GenerateThumbnailsButtonProps {
  readonly module: string
  readonly selectedElements: Array<DirectoryMetadata | FileMetadata>
}

const GenerateThumbnailsButton: FC<GenerateThumbnailsButtonProps> = ({
  module,
  selectedElements,
}) => {
  const [jobsActions] = useJobHandler()

  const generateThumbnails = useCallback(() => {
    Promise.all(
      selectedElements.map((m) => jobsActions.register({ type: 'thumbnailGeneration', module, metadata: m })),
    ).catch(() => {})
  }, [module, selectedElements, jobsActions])

  return (
    <MenuItem
      onAction={generateThumbnails}
      icon={<PhotoLibrary />}
      label="Generate thumbnails"
    />
  )
}

export default GenerateThumbnailsButton
