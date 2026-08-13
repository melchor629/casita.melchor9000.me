import { useRevalidator } from '@melchor629/nice-ssr'
import { Button, TableCell, TableRow, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useEditPermission } from '#actions/mutations/edit-permission.ts'
import { useRemovePermission } from '#actions/mutations/remove-permission.ts'
import type { GetApplication } from '#queries/application/get-application.ts'

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
  const [displayName, setDisplayName] = useState(permission.displayName || '')

  const cancelEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(false)
  }, [])

  const activateEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(true)
  }, [])

  const displayNameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.currentTarget.value), [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly) {
      return
    }

    editPermissionMutation.mutate({
      appKey: applicationId,
      name: permission.name,
      displayName: displayName || undefined,
    }, { onSuccess: () => { setEditMode(false); revalidate().catch(() => {}) } })
  }, [readOnly, editPermissionMutation, permission.name, applicationId, displayName, revalidate])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removePermissionMutation.mutate({
      appKey: applicationId,
      name: permission.name,
    }, { onSuccess: () => void revalidate() })
  }, [readOnly, canDelete, removePermissionMutation, permission.name, applicationId, revalidate])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(permission.displayName || '')
  }, [permission])

  if (editMode) {
    return (
      <TableRow>
        <TableCell>
          <TextInput type="text" size="small" className="mb-0" value={permission.name} readOnly />
        </TableCell>
        <TableCell>
          <TextInput type="text" size="small" className="mb-0" value={displayName} onChange={displayNameChanged} />
        </TableCell>
        <TableCell noWrap>
          <Button
            size="small"
            onClick={cancelEditMode}
            disabled={editPermissionMutation.isPending || removePermissionMutation.isPending}
            variant="text"
            color="secondary"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="small"
            onClick={save}
            disabled={removePermissionMutation.isPending}
            loading={editPermissionMutation.isPending}
            variant="text"
          >
            Save
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>{permission.name}</TableCell>
      <TableCell>{permission.displayName}</TableCell>
      <TableCell noWrap>
        {!readOnly && (
          <Button
            size="small"
            onClick={activateEditMode}
            disabled={removePermissionMutation.isPending}
            variant="text"
          >
            Edit
          </Button>
        )}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="small"
            onClick={remove}
            disabled={editPermissionMutation.isPending}
            loading={removePermissionMutation.isPending}
            variant="text"
            color="error"
          >
            Delete
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default EditApplicationPermissionRow
