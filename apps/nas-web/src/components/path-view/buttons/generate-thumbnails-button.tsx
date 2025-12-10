import { type FC, useCallback } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'
import { PhotoLibrary } from '../../icons'
import Button from './button'

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
    <Button onClick={generateThumbnails}>
      <PhotoLibrary height="18px" />
      <span> Generate thumbnails</span>
    </Button>
  )
}

export default GenerateThumbnailsButton
