import React, {
  useCallback, useMemo, useState,
} from 'react'
import * as fs from '@/api/fs'
import useApiClient from '@/hooks/use-api-client'
import * as Path from '@/utils/path'
import Alert from '../core/alert'
import Button from '../core/button'
import { TextInput } from '../form'
import Modal from '../modal-view'

interface NewFolderItemModalProps {
  readonly module: string
  readonly path: string
  readonly show?: boolean
  readonly onClose?: (hasCreatedFolder?: boolean) => void
}

export default function NewFolderItemModal({
  module, onClose, path, show,
}: NewFolderItemModalProps) {
  const apiClient = useApiClient()
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const newUrl = Path.join(Path.join('/', module, path), folderName)
  const onNewFolderImpl: React.MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    setError(null)
    fs.newFolder(apiClient, module, path, folderName)
      .then(() => { if (onClose) { onClose(true) } setFolderName(''); setError(null) })
      .catch((err) => setError(err as Error))
  }, [onClose, module, path, folderName, apiClient])

  const closeButton = useMemo(() => [
    <Button
      type="button"
      onClick={onNewFolderImpl}
      key="new-folder"
      disabled={!folderName}
    >
      Create
    </Button>,
  ], [folderName, onNewFolderImpl])

  return (
    <Modal
      id="new-folder"
      title={`Create a new folder at ${Path.basename(path) || path}`}
      onClose={useCallback(() => {
        onClose?.()
        setFolderName('')
        setError(null)
      }, [onClose])}
      show={show}
      buttons={closeButton}
      closeLabel="Cancel"
      portal
    >
      {error && (
        <Alert severity="error" title="There was an error during creation">
          {JSON.stringify(error)}
        </Alert>
      )}
      <TextInput
        type="text"
        id="new-folder-name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        helpText={newUrl}
      >
        Write the new folder&apos;s name
      </TextInput>
    </Modal>
  )
}
