import { type FC, useCallback } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'
import { DeleteSweep } from '../../icons'
import Button from './button'

interface DeleteThumbnailsButtonProps {
  readonly entries: Array<DirectoryMetadata | FileMetadata>
  readonly module: string
}

const DeleteThumbnailsButton: FC<DeleteThumbnailsButtonProps> = ({ entries, module }) => {
  const [jobsActions] = useJobHandler()

  const action = useCallback(() => {
    jobsActions.register({ type: 'thumbnailDelete', module, entries })
      .catch(() => {})
  }, [module, entries, jobsActions])

  return (
    <Button onClick={action}>
      <DeleteSweep width="18px" />
      <span> Delete Thumbnails</span>
    </Button>
  )
}

export default DeleteThumbnailsButton
