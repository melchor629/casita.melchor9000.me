import { MenuItem } from '@melchor629/ui'
import { DriveFileRenameOutline } from '@melchor629/ui/icons'
import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import RenameItemModal from '../../modals/rename-item-modal'

interface RenameButtonProps {
  readonly module: string
  readonly metadata: DirectoryMetadata | FileMetadata
  readonly disabled?: boolean
}

const RenameButton: FC<RenameButtonProps> = ({ disabled, metadata, module }) => {
  const [modalShown, setModalShown] = useState<DirectoryMetadata | FileMetadata | null>(null)

  const openModal = useCallback(() => {
    setModalShown(metadata)
  }, [metadata])

  return (
    <>
      <MenuItem
        onAction={openModal}
        disabled={disabled}
        icon={<DriveFileRenameOutline />}
        label="Rename"
      />

      <RenameItemModal
        module={module}
        entry={modalShown || undefined}
        show={!!modalShown}
        onClose={useCallback(() => setModalShown(null), [])}
      />
    </>
  )
}

export default RenameButton
