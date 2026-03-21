import { MenuItem } from '@melchor629/ui'
import { DeleteSweep } from '@melchor629/ui/icons'
import { type FC, useCallback } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'

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
    <MenuItem
      onAction={action}
      icon={<DeleteSweep />}
      label="Delete thumbnails"
    />
  )
}

export default DeleteThumbnailsButton
