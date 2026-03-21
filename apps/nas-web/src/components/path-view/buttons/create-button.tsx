import { MenuItem } from '@melchor629/ui'
import { CreateNewFolder } from '@melchor629/ui/icons'
import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import NewFolderItemModal from '../../modals/new-folder-modal'

interface CreateButtonProps {
  readonly module: string
  readonly metadata: DirectoryMetadata | FileMetadata
}

const CreateButton: FC<CreateButtonProps> = ({ metadata, module }) => {
  const [modalShown, setModalShown] = useState(false)

  const newFolderOpen = useCallback(() => {
    setModalShown(true)
  }, [])

  return (
    <>
      <MenuItem
        onAction={newFolderOpen}
        icon={<CreateNewFolder />}
        label="New folder"
      />

      <NewFolderItemModal
        module={module}
        path={metadata.path}
        show={modalShown}
        onClose={useCallback(() => setModalShown(false), [])}
      />
    </>
  )
}

export default CreateButton
