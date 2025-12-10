import React, {
  useCallback, useMemo, useState,
} from 'react'
import * as fs from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import * as Path from '@/utils/path'
import Modal from '../modal-view'

interface DeleteItemModalProps {
  readonly module: string
  readonly entries: Array<DirectoryMetadata | FileMetadata>
  readonly show?: boolean
  readonly onClose?: (hasDeleted?: boolean) => void
}

export default function DeleteItemModal({
  entries, module, onClose, show,
}: DeleteItemModalProps) {
  const apiClient = useApiClient()
  const [error, setError] = useState<Error[] | null>(null)

  const close = useCallback((hasDeleted?: boolean) => {
    onClose?.(hasDeleted)
    setError(null)
  }, [onClose])

  const onDeleteImpl: React.MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    const newErrors: Error[] = []
    setError(null)
    Promise.all(entries.map((entry) => (
      fs.remove(apiClient, module, entry.path, true).catch((err) => newErrors.push(err as Error))
    )))
      .then(() => close(true))
      .catch((err) => newErrors.push(err as Error))
      .finally(() => (newErrors.length ? setError(newErrors) : undefined))
  }, [apiClient, entries, module, close])

  const closeButton = useMemo(() => (
    <button type="button" className="btn btn-danger" onClick={onDeleteImpl} key="delete">Delete</button>
  ), [onDeleteImpl])
  const title = entries.length === 1 ? `Delete ${Path.basename(entries[0].path)}` : 'Delete items'
  const endDescription = entries.length === 1
    ? `this ${entries[0].type === 'dir' ? 'folder and all its content' : 'file'}`
    : 'these items'
  return (
    <Modal
      id="delete-item"
      title={title}
      onClose={close}
      show={show}
      buttons={[closeButton]}
      closeLabel="Cancel"
      portal
    >
      {error && (
        <div className="alert alert-danger" role="alert" style={{ wordBreak: 'break-all' }}>
          {JSON.stringify(error)}
        </div>
      )}
      <p>
        Do you confirm you want to remove
        {' '}
        {endDescription}
        ?
        <br />
        <span className="text-warning">
          <small>This action cannot be undone</small>
        </span>
      </p>
      {entries.length !== 1 && (
        <ul>
          {entries.map((entry) => <li key={entry.path}>{Path.basename(entry.path)}</li>)}
        </ul>
      )}
    </Modal>
  )
}
