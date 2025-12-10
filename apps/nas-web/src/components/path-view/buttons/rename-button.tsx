import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { DriveFileRenameOutline } from '../../icons'
import RenameItemModal from '../../modals/rename-item-modal'
import Button from './button'

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
      <Button onClick={openModal} disabled={disabled}>
        <DriveFileRenameOutline height="18px" />
        <span> Rename</span>
      </Button>

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
