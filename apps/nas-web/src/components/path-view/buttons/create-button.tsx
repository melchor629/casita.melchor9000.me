import { type FC, useCallback, useState } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { CreateNewFolder } from '../../icons'
import NewFolderItemModal from '../../modals/new-folder-modal'
import Button from './button'

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
      <Button onClick={newFolderOpen}>
        <CreateNewFolder width="18px" />
        <span> New folder</span>
      </Button>

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
