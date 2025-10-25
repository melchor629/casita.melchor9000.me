import { useRevalidator } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useEditPermission } from '../../../actions/mutations/edit-permission'
import { useRemovePermission } from '../../../actions/mutations/remove-permission'
import type { GetApplication } from '../../../../queries/get-application'
import {
  Button,
  Input,
  TableColumn,
  TableRow,
} from '../../ui'

type EditApplicationPermissionRowProps = Readonly<{
  applicationId: string
  canDelete: boolean
  permission: GetApplication['permissions'][0]
  readOnly: boolean
}>

const EditApplicationPermissionRow = ({
  applicationId,
  canDelete,
  permission,
  readOnly,
}: EditApplicationPermissionRowProps) => {
  const editPermissionMutation = useEditPermission()
  const removePermissionMutation = useRemovePermission()
  const revalidate = useRevalidator()
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(permission.name)
  const [displayName, setDisplayName] = useState(permission.displayName || '')

  const cancelEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(false)
  }, [])

  const activateEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(true)
  }, [])

  const nameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), [])
  const displayNameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.currentTarget.value), [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly) {
      return
    }

    editPermissionMutation.mutate({
      id: permission.id,
      appId: applicationId,
      name,
      displayName: displayName || null,
    }, { onSuccess: () => { setEditMode(false); revalidate().catch(() => {}) } })
  }, [readOnly, editPermissionMutation, permission.id, applicationId, name, displayName, revalidate])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removePermissionMutation.mutate({
      id: permission.id,
      appId: applicationId,
    }, { onSuccess: () => void revalidate() })
  }, [readOnly, canDelete, removePermissionMutation, permission.id, applicationId, revalidate])

  useEffect(() => {
    setName(permission.name)
    setDisplayName(permission.displayName || '')
  }, [permission])

  if (editMode) {
    return (
      <TableRow hover>
        <TableColumn>{permission.id}</TableColumn>
        <TableColumn>
          <Input type="text" className="mb-0" value={name} onChange={nameChanged} />
        </TableColumn>
        <TableColumn>
          <Input type="text" className="mb-0" value={displayName} onChange={displayNameChanged} />
        </TableColumn>
        <TableColumn>
          <Button
            size="sm"
            onClick={cancelEditMode}
            disabled={editPermissionMutation.isPending || removePermissionMutation.isPending}
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="sm"
            onClick={save}
            disabled={removePermissionMutation.isPending}
            loading={editPermissionMutation.isPending}
          >
            Save
          </Button>
        </TableColumn>
      </TableRow>
    )
  }

  return (
    <TableRow hover>
      <TableColumn>{permission.id}</TableColumn>
      <TableColumn>{permission.name}</TableColumn>
      <TableColumn>{permission.displayName}</TableColumn>
      <TableColumn>
        {!readOnly && (
          <Button
            size="sm"
            onClick={activateEditMode}
            disabled={removePermissionMutation.isPending}
          >
            Edit
          </Button>
        )}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="sm"
            onClick={remove}
            disabled={editPermissionMutation.isPending}
            loading={removePermissionMutation.isPending}
          >
            Delete
          </Button>
        )}
      </TableColumn>
    </TableRow>
  )
}

export default EditApplicationPermissionRow
