import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import * as fs from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import * as Path from '@/utils/path'
import { TextInput } from '../form'
import Modal from '../modal-view'

interface RenameItemModalProps {
  readonly module: string
  readonly entry?: FileMetadata | DirectoryMetadata
  readonly show?: boolean
  readonly onClose?: (hasRenamed?: boolean) => void
}

export default function RenameItemModal({
  entry, module, onClose, show,
}: RenameItemModalProps) {
  const path = entry ? entry.path : ''
  const type = entry ? entry.type : 'dir'

  const apiClient = useApiClient()
  const [newName, setNewName] = useState(Path.basename(path) || path)
  const [error, setError] = useState<Error | null>(null)
  const newUrl = Path.join(Path.dirname(Path.join('/', module, path)), newName)
  const onRenameImpl: React.MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    setError(null)
    fs.rename(apiClient, module, path, newName)
      .then(() => onClose && onClose(true))
      .catch((err) => setError(err as Error))
  }, [module, path, newName, onClose, apiClient])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null)
    setNewName(Path.basename(path) || path)
  }, [module, path, show])

  const closeButton = useMemo(() => [
    <button
      type="button"
      className="btn btn-warning"
      onClick={onRenameImpl}
      key="rename"
      disabled={!newName}
    >
      Rename
    </button>,
  ], [onRenameImpl, newName])

  return (
    <Modal
      id="rename-item"
      title={`Rename ${Path.basename(path) || path}`}
      onClose={onClose}
      show={show}
      buttons={closeButton}
      closeLabel="Cancel"
      portal
    >
      {error && (
        <div className="alert alert-danger" role="alert" style={{ wordBreak: 'break-all' }}>
          {JSON.stringify(error)}
        </div>
      )}
      <TextInput
        type="text"
        id="rename-item-name"
        isInvalid={!!error}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        helpText={newUrl}
      >
        Write the new
        {' '}
        {type === 'dir' ? 'folder' : 'file'}
        &apos;s name
      </TextInput>
    </Modal>
  )
}
