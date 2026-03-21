import { MenuItem } from '@melchor629/ui'
import { DeleteForever } from '@melchor629/ui/icons'
import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import DeleteItemModal from '../../modals/delete-item-modal'

interface DeleteButtonProps {
  readonly module: string
  readonly entries: Array<DirectoryMetadata | FileMetadata>
  readonly disabled?: boolean
}

const DeleteButton: FC<DeleteButtonProps> = ({ disabled, entries, module }) => {
  const [modalShown, setModalShown] = useState<Array<DirectoryMetadata | FileMetadata> | null>(null)

  const openModal = useCallback(() => {
    setModalShown(entries)
  }, [entries])

  return (
    <>
      <MenuItem
        onAction={openModal}
        disabled={disabled}
        icon={<DeleteForever />}
        label="Delete"
      />

      <DeleteItemModal
        module={module}
        entries={modalShown || []}
        show={!!modalShown}
        onClose={useCallback(() => setModalShown(null), [])}
      />
    </>
  )
}

export default DeleteButton
