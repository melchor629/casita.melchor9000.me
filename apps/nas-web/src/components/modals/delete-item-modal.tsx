import React, {
  useCallback, useMemo, useState,
} from 'react'
import * as fs from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import * as Path from '@/utils/path'
import Alert from '../core/alert'
import Button from '../core/button'
import Text from '../core/text'
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
    <Button type="button" color="error" onClick={onDeleteImpl} key="delete">Delete</Button>
  ), [onDeleteImpl])
  const title = entries.length === 1 ? 'Delete item' : 'Delete items'
  const endDescription = entries.length === 1
    ? `this ${entries[0].type === 'dir' ? 'folder and all its content' : 'file'}`
    : 'these items'
  return (
    <Modal
      id="delete-item"
      size="lg"
      title={title}
      onClose={close}
      show={show}
      buttons={[closeButton]}
      closeLabel="Cancel"
      portal
    >
      {error && (
        <Alert severity="error" title="There was an error during deletion">
          {JSON.stringify(error)}
        </Alert>
      )}
      <Text>
        Do you confirm you want to remove
        {' '}
        {endDescription}
        ?
        <br />
        <Text component="span" color="primary">
          This action cannot be undone!
        </Text>
      </Text>
      {entries.length > 0 && (
        <ul className="mt-3">
          {entries.map((entry) => <li key={entry.path}>{Path.basename(entry.path)}</li>)}
        </ul>
      )}
    </Modal>
  )
}
