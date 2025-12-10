import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { DeleteForever } from '../../icons'
import DeleteItemModal from '../../modals/delete-item-modal'
import Button from './button'

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
      <Button onClick={openModal} disabled={disabled}>
        <DeleteForever width="18px" />
        <span> Delete</span>
      </Button>

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
